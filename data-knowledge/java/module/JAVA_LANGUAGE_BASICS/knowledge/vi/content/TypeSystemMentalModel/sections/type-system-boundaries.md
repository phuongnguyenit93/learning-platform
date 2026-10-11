Trình biên dịch có thể kiểm tra:

- phân giải tên/kiểu;
- tính tương thích khi gán;
- khả năng áp dụng của các overload;
- definite assignment;
- nhiều ràng buộc về quyền truy cập và ép kiểu.

Thời điểm chạy vẫn phải xử lý những điều trình biên dịch không thể biết chắc:

- đối tượng thật có đúng kiểu để downcast không;
- giá trị ghi vào mảng có đúng kiểu phần tử thực tế không;
- tham chiếu có `null` không;
- chỉ số có nằm trong phạm vi hợp lệ của mảng không.

Đó là lý do Java vừa có kiểm tra kiểu tĩnh vừa có các exception ở thời điểm chạy như `ClassCastException`, `ArrayStoreException`, `NullPointerException`.

### Bảng tổng kết các ranh giới đã gặp

| Tình huống | Lúc biên dịch biết/kiểm tra | Lúc chạy còn phải kiểm tra |
|---|---|---|
| biến cục bộ | definite assignment | giá trị cụ thể |
| nạp chồng | ứng viên áp dụng được + cụ thể nhất | không chọn lại overload |
| ghi đè | chữ ký đã được chọn | kiểu thực tế của receiver để phân phối lời gọi |
| downcast | quan hệ ép kiểu hợp lệ | đối tượng thật có đúng kiểu đích không |
| ghi vào mảng | phép gán theo kiểu tĩnh có vẻ hợp lệ | kiểu phần tử thực tế của mảng |
| chỉ số mảng | biểu thức tương thích số nguyên | chỉ số có nằm trong giới hạn không |
| truy cập qua tham chiếu | thành viên tồn tại trên kiểu tĩnh | tham chiếu có `null` không |

Chương cuối dùng các ranh giới này để ghép toàn bộ nền tảng ngôn ngữ Java thành một chuỗi suy luận xuyên suốt.
