### Bộ nhớ đệm static do ClassLoader cha sở hữu

Đây là mẫu điển hình:

```text
class ở Application ClassLoader
→ bộ nhớ đệm static
→ instance/Class của plugin
→ PluginClassLoader
```

Cách sửa phải nằm ở vòng đời: xóa phần tử khi plugin dừng, hoặc thiết kế bộ nhớ đệm với ngữ nghĩa tham chiếu yếu khi bài toán thực sự phù hợp.

### ThreadLocal trên luồng trong nhóm luồng (thread pool)

```java
threadLocal.set(pluginObject);
```

Nếu luồng thuộc máy chủ hoặc executor sống lâu hơn plugin, giá trị có thể giữ đối tượng của plugin và ClassLoader. Với `ThreadLocalMap`, tham chiếu tới key có ngữ nghĩa tham chiếu yếu, nhưng value vẫn có thể bị giữ cho tới khi phần tử được dọn; vì vậy “mất tham chiếu tới key của ThreadLocal” không phải chiến lược dọn dẹp đáng tin cậy.

Mẫu xử lý:

```java
try {
    threadLocal.set(pluginContext);
    runPlugin();
} finally {
    threadLocal.remove();
}
```

### Bộ lắng nghe (listener/subscriber)

```text
event bus của ứng dụng
→ bộ lắng nghe do plugin triển khai
→ plugin Class
→ ClassLoader
```

Khi plugin dừng phải gỡ đăng ký bộ lắng nghe.

### TCCL

TCCL đã học ở chương trước:

```text
luồng trong pool sống lâu
→ contextClassLoader
→ PluginClassLoader
```

Vì vậy việc lưu, gán rồi khôi phục TCCL trong `finally` vừa là quy tắc về tính đúng đắn vừa giúp phòng tránh rò rỉ.
