# ClassLoader tùy chỉnh và cô lập

Các ClassLoader có sẵn đủ cho phần lớn ứng dụng. Nhưng hệ thống plugin đặt ra một bài toán khác:

```text
classpath của ứng dụng chủ
→ không chứa phần triển khai của plugin

bytecode của plugin
→ có thể nằm trong thư mục riêng, JAR được tải lên, cơ sở dữ liệu, artifact trên mạng
  hoặc một nguồn byte do ứng dụng quản lý
```

JVM vẫn cần một `Class<?>` để thực thi plugin. **ClassLoader tùy chỉnh** là điểm mở rộng cho phép ứng dụng cung cấp cách tìm bytecode của class hoặc tạo một không gian tên nạp riêng.

Mục tiêu của ClassLoader tùy chỉnh không phải “viết lại JVM”. Ta vẫn để JVM kiểm tra, liên kết và khởi tạo class. ClassLoader tùy chỉnh chủ yếu quyết định **khi ClassLoader cha không đáp ứng yêu cầu thì bytecode của class sẽ đến từ đâu và ClassLoader nào sẽ trở thành ClassLoader định nghĩa (defining ClassLoader)**.
