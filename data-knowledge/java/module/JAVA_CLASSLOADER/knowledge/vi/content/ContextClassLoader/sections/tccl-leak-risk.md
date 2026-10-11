Một `Thread` sống lâu có thể trở thành GC root hoặc vẫn reachable từ runtime/thread pool. Nếu TCCL của nó trỏ tới plugin loader:

```text
Thread sống lâu
    ↓ contextClassLoader
PluginClassLoader
    ↓
plugin Class objects
    ↓
static state/resources
```

Ngay cả khi ứng dụng đã “remove plugin” khỏi registry, loader vẫn có thể reachable qua thread context.

Ví dụ lỗi:

```java
executor.submit(() -> {
    Thread.currentThread().setContextClassLoader(pluginLoader);
    runPlugin();
    // quên restore
});
```

Nếu executor dùng worker thread lâu dài, reference tới `pluginLoader` có thể tồn tại vượt quá plugin lifecycle.

Pattern đúng vẫn là:

```java
ClassLoader previous =
        Thread.currentThread().getContextClassLoader();

try {
    Thread.currentThread().setContextClassLoader(pluginLoader);
    runPlugin();
} finally {
    Thread.currentThread().setContextClassLoader(previous);
}
```

Khi tạo thread mới, context ClassLoader thường được kế thừa từ thread tạo nó theo `Thread` semantics. Vì vậy plugin code tự tạo thread sống lâu cũng cần được quản lý và dừng khi plugin unload.

Điểm nối sang chương Resource Loading:

```text
TCCL
→ thường được framework chọn làm loader context

ClassLoader
→ ngoài class bytes còn có API tìm resource
```

Tiếp theo ta sẽ phân biệt chính xác `Class.getResource`, `ClassLoader.getResource` và filesystem path, vì ba thứ này rất dễ bị trộn lẫn.
