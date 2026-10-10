`ServiceLoader` là ví dụ chuẩn.

Giả sử SPI dùng chung:

```java
package com.example.api;

public interface Plugin {
    String name();
}
```

Classpath của ứng dụng/plugin chứa provider và cấu hình service tương ứng. Code framework có thể dùng:

```java
import java.util.ServiceLoader;

ServiceLoader<Plugin> plugins =
        ServiceLoader.load(Plugin.class);

for (Plugin plugin : plugins) {
    System.out.println(plugin.name());
}
```

`ServiceLoader.load(Plugin.class)` dùng context ClassLoader của thread hiện tại để tìm provider. Đây là một cách code thư viện ở một loader có thể tìm provider mà loader context của ứng dụng nhìn thấy.

Ta cũng có thể truyền loader một cách tường minh:

```java
ClassLoader loader =
        Thread.currentThread().getContextClassLoader();

ServiceLoader<Plugin> plugins =
        ServiceLoader.load(Plugin.class, loader);
```

Điều này làm phụ thuộc vào ClassLoader dễ nhìn thấy hơn. Khi bên gọi **đã biết chính xác ClassLoader cần dùng**, truyền loader tường minh thường rõ ràng hơn dựa vào trạng thái TCCL ngầm. TCCL hữu ích nhất khi hợp đồng của framework cần một ngữ cảnh ClassLoader gắn với luồng hiện tại để code ở tầng cha có thể làm việc thay cho ứng dụng ở tầng con.

TCCL thường xuất hiện quanh:

- tìm SPI/provider;
- tích hợp container/application server;
- plugin framework;
- tìm resource;
- code framework chạy thay mặt ứng dụng.

Không phải mọi thư viện đều cần TCCL. Nếu defining loader của thư viện đã nhìn thấy tất cả implementation cần dùng, nạp trực tiếp sẽ đơn giản hơn.
