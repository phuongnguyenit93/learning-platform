Nhiều lỗi khi kết hợp hành vi xuất phát từ việc chỉ đọc tên phương thức mà không theo dõi dữ liệu. Cách an toàn là viết rõ luồng giá trị trước.

```text
đầu vào
  -> trim
  -> parse
  -> validate
  -> kết quả
```

Sau đó chọn API sao cho luồng đọc khớp với ý định. Với `Function`, `andThen` thường dễ đọc từ trái sang phải, còn `compose` đặt tên hàm chạy sau ở phía trước.

Hệ thống kiểu giúp kiểm tra thêm: nếu một hàm trả về `Integer`, hàm kế tiếp phải nhận `Integer` hoặc kiểu tương thích. Trình biên dịch bắt được nhiều lỗi thứ tự về kiểu, nhưng không thể biết một thứ tự vẫn hợp lệ về kiểu có đúng với quy tắc nghiệp vụ hay không.
