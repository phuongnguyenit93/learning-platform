TCCL là mutable state của `Thread`. Nếu một thao tác plugin cần tạm thời dùng plugin loader, pattern an toàn là:

Nếu chưa học sâu concurrency, chỉ cần hiểu **`Thread` là một luồng thực thi**, còn **thread pool tái sử dụng một số thread để chạy nhiều task khác nhau**. Chính vì thread được tái sử dụng nên state gắn trên thread có thể “rò” sang task kế tiếp nếu không được khôi phục.

```java
Thread thread = Thread.currentThread();
ClassLoader previous = thread.getContextClassLoader();

try {
    thread.setContextClassLoader(pluginLoader);

    ServiceLoader<Plugin> plugins =
            ServiceLoader.load(Plugin.class);

    plugins.forEach(plugin ->
            System.out.println(plugin.name())
    );
} finally {
    thread.setContextClassLoader(previous);
}
```

Ba bước phải đi cùng nhau:

```text
lưu giá trị cũ
    ↓
gán context tạm thời
    ↓
thực hiện công việc
    ↓ finally
khôi phục giá trị cũ
```

Tại sao `finally` quan trọng? Vì quá trình nạp provider hoặc code plugin có thể ném exception. Nếu không restore, thread tiếp tục xử lý task khác với loader context sai.

Điều này đặc biệt nguy hiểm trong thread pool:

```text
yêu cầu A
→ set pluginLoaderA
→ exception
→ quên restore

cùng pooled thread xử lý yêu cầu B
→ vẫn mang pluginLoaderA
```

TCCL vì vậy nên được xem như context có phạm vi rõ ràng, tương tự những mutable context khác gắn với thread: gán trong phạm vi càng hẹp càng tốt và luôn khôi phục.
