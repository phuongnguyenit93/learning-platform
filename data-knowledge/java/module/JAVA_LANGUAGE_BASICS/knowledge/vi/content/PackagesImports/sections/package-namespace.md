Ví dụ:

```java
package com.example.order;
```

làm lớp `Order` có tên đầy đủ:

```text
com.example.order.Order
```

Hai lớp có cùng tên đơn giản vẫn có thể cùng tồn tại nếu thuộc `package` khác nhau.

`package` không chỉ phục vụ việc tổ chức tệp; nó còn tham gia kiểm soát truy cập và định danh kiểu.

### Khai báo `package` và cấu trúc mã nguồn

Theo quy ước Java, cấu trúc thư mục thường phản ánh tên `package`:

```text
src/main/java/com/example/order/Order.java
                    ↓
package com.example.order;
```

Đây là quy ước quan trọng cho công cụ xây dựng và IDE, nhưng khái niệm cốt lõi là khai báo `package` góp phần tạo tên kiểu đầy đủ. Đừng suy luận rằng `package` chỉ đơn thuần là thư mục.

Quy ước đặt tên thường dùng tên miền đảo ngược viết thường để giảm xung đột: `com.example.order`.

`package` mặc định/không tên có thể dùng cho ví dụ rất nhỏ nhưng không phù hợp với dự án thực tế vì khó tổ chức và tương tác giữa các `package`.
