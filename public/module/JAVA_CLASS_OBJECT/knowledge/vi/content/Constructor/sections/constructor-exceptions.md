Hàm khởi tạo có thể ném ngoại lệ nếu không thể tạo đối tượng hợp lệ.

Nếu quá trình khởi tạo thất bại, bên gọi không nhận một tham chiếu tới đối tượng hoàn chỉnh từ biểu thức `new`. Nhưng các tác động phụ đã xảy ra trước lỗi, ví dụ đăng ký đối tượng ra bên ngoài, vẫn có thể tồn tại.

Vì vậy tránh chia sẻ `this` ra ngoài trước khi hàm khởi tạo hoàn tất; chương về quá trình tạo đối tượng sẽ quay lại rủi ro này.

Chương tiếp theo giải thích tham chiếu `this` tới đối tượng hiện tại và từ khóa/cú pháp `super` dùng để chọn ngữ cảnh hàm khởi tạo hoặc thành viên của lớp cha.
