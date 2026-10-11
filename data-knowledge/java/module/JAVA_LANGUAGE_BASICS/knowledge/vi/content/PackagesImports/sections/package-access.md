Khi không ghi từ khóa kiểm soát truy cập, kiểu top-level hoặc thành viên phù hợp có quyền truy cập `package-private`.

Điều này cho phép nhiều lớp trong cùng `package` cộng tác mà không cần công khai API ra toàn bộ cơ sở mã.

Vì vậy `package` có thể tạo một **ranh giới đóng gói ở mức nhóm kiểu**, không chỉ là thư mục để sắp tệp.

### API công khai và cộng tác nội bộ

Một lớp hỗ trợ không cần dùng ngoài `package` thường không cần `public`. Giảm phạm vi truy cập giúp hợp đồng API nhỏ hơn và cho phép thay đổi cách triển khai mà ít ảnh hưởng bên gọi bên ngoài hơn.

```java
class OrderValidator { // package-private top-level class
    boolean valid(Object order) {
        return order != null;
    }
}
```

Các mức truy cập chi tiết sẽ xuất hiện ở mô-đun Lớp/Object/OOP; ở đây chỉ cần giữ mô hình tư duy rằng `package` vừa là không gian tên vừa có thể tạo ranh giới truy cập.

### Phân cấp tên `package` không phải phân cấp quyền truy cập

Ví dụ:

```java
// package com.example;
class InternalHelper {
    static void run() { }
}
```

Mã trong:

```java
package com.example.internal;
```

không được xem là “nằm trong package cha” `com.example` theo nghĩa quyền truy cập `package-private`. Nếu cần chia sẻ qua ranh giới `package`, API phải có phạm vi truy cập phù hợp thay vì dựa vào tiền tố tên giống nhau.

Chương tiếp theo tổng hợp các ranh giới giữa quyết định ở thời điểm biên dịch và kiểm tra ở thời điểm chạy.
