Trước khi chọn `abstract class` hoặc `interface`, hãy kiểm tra:

1. Bên gọi cần biết **hợp đồng** hay cần phụ thuộc vào **phần triển khai cụ thể**?
2. Các kiểu con có thật sự chia sẻ trạng thái/bất biến/quy tắc khởi tạo không?
3. Quan hệ có phải một họ lớp tự nhiên hay chỉ là một vai trò/khả năng cắt ngang nhiều họ lớp?
4. Một lớp có cần kết hợp nhiều vai trò độc lập không?
5. Nếu interface có `default`, liệu hành vi mặc định có thật sự đúng cho mọi cách triển khai hợp lệ không?
6. Nếu nhiều interface được kết hợp, có nguy cơ xung đột chữ ký phương thức hoặc hành vi mặc định không?
7. Nếu cần gọi `InterfaceName.super`, interface được gọi có phải interface cha trực tiếp phù hợp với cú pháp Java không?

Danh sách kiểm tra này giúp tránh hai lỗi phổ biến: dùng lớp trừu tượng chỉ để “tái sử dụng vài dòng mã”, hoặc tạo interface chỉ vì muốn có thêm một lớp trừu tượng mà không có hợp đồng rõ ràng.
