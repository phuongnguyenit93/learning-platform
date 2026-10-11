Biến kiểu tham chiếu giữ **giá trị tham chiếu**, không chứa đối tượng “bên trong biến”. Nhiều biến có thể cùng tham chiếu một đối tượng.

Đối tượng có thể tiếp tục được chương trình truy cập sau khi một biến cục bộ ra khỏi phạm vi nếu vẫn còn tham chiếu khác dẫn tới nó. Garbage Collector quyết định khả năng thu hồi bộ nhớ dựa trên tính còn-truy-cập-được (reachability), không dựa trên việc một tên biến vừa hết phạm vi.

Vòng đời tài nguyên là vấn đề khác: file/socket phải được đóng có chủ ý; không chờ GC để giải phóng tài nguyên bên ngoài JVM.

Chương tiếp theo bắt đầu từ thời điểm một đối tượng được tạo: **hàm khởi tạo làm gì để thiết lập trạng thái hợp lệ?**
