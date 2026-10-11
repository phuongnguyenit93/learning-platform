`defineClass` là cầu nối từ binary bytes tới runtime class do loader hiện tại định nghĩa:

```java
byte[] bytes = ...;
Class<?> type = defineClass(
        "com.example.plugins.PaymentPlugin",
        bytes,
        0,
        bytes.length
);
```

Khi lời gọi thành công:

```text
binary name
  +
class bytes
  +
PluginClassLoader instance
        ↓ defineClass
Class<?> tại runtime có defining loader = instance PluginClassLoader
```

`defineClass` thiết lập quan hệ giữa class runtime và defining ClassLoader, đồng thời JVM thực hiện các kiểm tra cần thiết ở thời điểm định nghĩa như tên, định dạng và ranh giới bảo mật. Verification là một phần của linking và JVM có thể thực hiện sớm khi cần. Nếu bytecode sai định dạng, tên không phù hợp hoặc vi phạm ràng buộc nạp class, JVM có thể ném `ClassFormatError`, `LinkageError`, `SecurityException` hoặc lỗi liên quan tùy nguyên nhân.

Một điểm rất quan trọng:

> **Defining loader là một phần của runtime type identity.**

Nếu hai instance `PluginClassLoader` khác nhau cùng gọi `defineClass` với cùng binary name và cùng byte content, JVM vẫn có thể tạo hai type khác nhau. Chương Class Identity sẽ chứng minh điều đó.

### defineClass chưa đồng nghĩa với khởi tạo

Sau khi `defineClass` tạo `Class<?>`, class chưa nhất thiết đã chạy static initializer. Initialization vẫn theo các rule lifecycle đã học.

```text
defineClass
→ runtime Class được tạo
→ linking khi JVM cần
→ initialization chỉ khi trigger phù hợp
```
