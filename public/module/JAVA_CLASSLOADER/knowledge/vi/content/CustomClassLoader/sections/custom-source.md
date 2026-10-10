Nguồn tùy chỉnh có thể là bất kỳ nơi nào ứng dụng có thể lấy đúng class-file bytes. Để tập trung vào ClassLoader thay vì I/O, ta có thể dùng in-memory map:

```java
import java.util.Map;

public final class InMemoryPluginClassLoader extends ClassLoader {
    private final Map<String, byte[]> classes;

    public InMemoryPluginClassLoader(
            ClassLoader parent,
            Map<String, byte[]> classes
    ) {
        super(parent);
        this.classes = Map.copyOf(classes);
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] bytes = classes.get(name);
        if (bytes == null) {
            throw new ClassNotFoundException(name);
        }
        return defineClass(name, bytes, 0, bytes.length);
    }
}
```

Cách dùng:

```java
Map<String, byte[]> pluginBytes = Map.of(
        "com.example.plugins.PaymentPlugin",
        compiledPaymentPluginBytes
);

ClassLoader loader = new InMemoryPluginClassLoader(
        Plugin.class.getClassLoader(),
        pluginBytes
);

Class<?> implementation =
        loader.loadClass("com.example.plugins.PaymentPlugin");
```

Ở đây `compiledPaymentPluginBytes` chỉ là **`byte[]` chứa class-file bytes đã được compile/read sẵn**. Ta cố ý bỏ qua phần I/O/compile để tập trung vào ClassLoader contract; chương này không yêu cầu bạn tự viết compiler hay tự đọc JAR bằng tay.

Điểm thiết kế đáng chú ý là parent:

```java
Plugin.class.getClassLoader()
```

Nếu `Plugin` là API dùng chung của host, đặt loader của API làm parent giúp plugin implementation resolve về **cùng một `Plugin` type** mà host đang dùng.

Trong môi trường thực tế, nguồn có thể là URL hoặc thư mục JAR. `URLClassLoader` vẫn là một implementation có thể dùng khi phù hợp; custom loader chỉ cần khi contract lookup/tách biệt của ứng dụng khác với loader có sẵn.

### Đừng gắn ClassLoader tùy chỉnh với một mô hình lưu trữ cụ thể

ClassLoader contract quan tâm tới binary name và bytes. Cách lấy bytes thuộc về ứng dụng:

```text
binary name
→ bộ phân giải nguồn
→ byte[]
→ defineClass
```

Tách bộ phân giải nguồn khỏi logic loader giúp test, cache và dọn dẹp lifecycle dễ hơn.
