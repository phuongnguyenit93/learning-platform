Mật mã học xuất hiện khi dữ liệu cần giữ một hoặc nhiều **bảo đảm bảo mật** trước một đối thủ có khả năng đọc, sửa hoặc giả mạo dữ liệu.

Ba mục tiêu cốt lõi của module này là:

- **tính bí mật (confidentiality)**: người không có quyền không đọc được nội dung;
- **tính toàn vẹn (integrity)**: thay đổi trái phép phải có khả năng bị phát hiện;
- **tính xác thực (authenticity)**: bên nhận có cơ sở kiểm tra dữ liệu hoặc danh tính thực sự gắn với bên nào.

Một cơ chế không tự động cung cấp cả ba mục tiêu. Mã hóa có thể che nội dung nhưng một chế độ mã hóa không xác thực vẫn có thể cho phép dữ liệu bị sửa mà không được phát hiện. Hàm băm tạo dấu vân tay nhưng không có bí mật nên không tự chứng minh ai đã tạo dữ liệu. MAC và chữ ký số giải quyết bài toán xác thực theo hai mô hình khóa khác nhau.

Mô hình tư duy quan trọng là: **xác định bảo đảm cần giữ trước, rồi mới chọn primitive và Java API**. Nếu bắt đầu bằng tên class hoặc tên thuật toán, rất dễ dùng đúng API cho sai bài toán.
