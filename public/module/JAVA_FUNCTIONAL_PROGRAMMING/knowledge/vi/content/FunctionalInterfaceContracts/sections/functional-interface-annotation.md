`@FunctionalInterface` yêu cầu trình biên dịch xác nhận giao diện thật sự thỏa các quy tắc giao diện hàm.

```java
@FunctionalInterface
interface Validator<T> {
    boolean isValid(T value);
}
```

Chú thích (annotation) này vừa là tài liệu thể hiện ý định thiết kế, vừa là hàng rào kiểm tra. Nếu sau này có người thêm một hợp đồng trừu tượng thứ hai không tương thích, lỗi biên dịch xuất hiện ngay tại định nghĩa giao diện.

`@FunctionalInterface` **không bắt buộc**. Một giao diện không có chú thích này nhưng vẫn thỏa quy tắc cấu trúc thì vẫn là giao diện hàm và vẫn có thể làm kiểu đích cho lambda.

Nên dùng chú thích này khi giao diện được chủ đích thiết kế như một hợp đồng hàm, vì nó cho người đọc biết rằng việc giữ một hợp đồng hàm duy nhất là một phần của thiết kế API.
