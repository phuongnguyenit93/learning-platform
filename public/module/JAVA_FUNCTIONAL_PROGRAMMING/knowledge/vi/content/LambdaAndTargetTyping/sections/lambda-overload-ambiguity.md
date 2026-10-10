Việc nạp chồng có thể trở nên mơ hồ nếu cùng một hình dạng lambda tương thích với nhiều tham số có kiểu giao diện hàm.

```java
void use(Callable<String> task) { }
void use(Supplier<String> task) { }

// use(() -> "done"); // mơ hồ
```

Cả hai kiểu đích đều mô tả hành vi không nhận tham số và trả về `String`, nên bản thân lambda chưa đủ để chọn nạp chồng.

Có thể chỉ rõ kiểu đích bằng phép ép kiểu (cast):

```java
use((Supplier<String>) () -> "done");
```

hoặc gán lambda vào một biến có kiểu rõ ràng trước khi gọi phương thức.

Nếu tự thiết kế API, nên tránh nạp chồng chỉ khác nhau bằng các giao diện hàm không liên quan nhưng có cùng hình dạng lambda. Kiểu API này khiến lời gọi đơn giản trở nên khó hiểu cho cả trình biên dịch lẫn người đọc.
