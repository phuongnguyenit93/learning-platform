Trường hợp dễ thấy nhất là thêm phương thức trừu tượng thứ hai không liên quan:

```java
@FunctionalInterface
interface BrokenRule {
    boolean test(String value);
    String describe(); // lỗi biên dịch: không còn là giao diện hàm
}
```

Lỗi cũng có thể đến từ kế thừa khi các khai báo trừu tượng không thể hợp thành một phương thức ghi đè hợp lệ, ví dụ kiểu trả về xung đột.

Nếu giao diện vốn được thiết kế để dùng với lambda, không nên chỉ xóa `@FunctionalInterface` để làm mất lỗi. Hãy xem lại khái niệm trừu tượng:

- giữ một hành vi trừu tượng và chuyển hàm hỗ trợ phù hợp thành phương thức `default` hoặc `static`;
- tách các trách nhiệm không liên quan thành nhiều giao diện;
- dùng giao diện thông thường nếu khái niệm trừu tượng thật sự cần nhiều thao tác trừu tượng.

Mục tiêu không phải biến mọi giao diện thành giao diện hàm. Chỉ dùng mô hình này khi **một hợp đồng hành vi** thực sự mô tả đúng khái niệm trừu tượng.
