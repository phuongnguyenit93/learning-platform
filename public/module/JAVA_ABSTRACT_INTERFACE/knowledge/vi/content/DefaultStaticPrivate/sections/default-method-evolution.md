Một lý do quan trọng khiến phương thức `default` tồn tại là khả năng **mở rộng interface theo thời gian (interface evolution)**: thư viện có thể bổ sung một hành vi với phần triển khai mặc định mà không buộc mọi lớp triển khai cũ phải thêm mã nguồn ngay lập tức.

Phương thức `default` không biến mọi thay đổi thành tương thích:

- thêm phương thức abstract mới vẫn có thể làm lớp triển khai cũ không còn biên dịch được;
- thêm phương thức `default` có thể tạo xung đột với interface khác;
- thay đổi ý nghĩa hợp đồng vẫn có thể làm mã phía sử dụng hoạt động sai.

Interface con còn có thể **biến một phương thức `default` được kế thừa trở lại thành yêu cầu abstract** bằng cách khai báo lại mà không có phần thân:

```java
interface Base {
    default Number value() { return 0; }
}

interface Specific extends Base {
    @Override
    Integer value();
}
```

Chi tiết này trước hết là một phần của cơ chế `default`; nó cũng cho thấy interface con có thể tinh chỉnh hợp đồng thay vì bắt buộc giữ nguyên hành vi mặc định của interface cha.

Phần tiếp theo dùng chính phương thức `default` để xem Java giải quyết xung đột khi một lớp triển khai nhiều interface như thế nào.
