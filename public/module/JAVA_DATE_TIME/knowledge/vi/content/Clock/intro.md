# Clock và thời gian có thể kiểm thử

Mã dùng thời gian thường có một phụ thuộc vô hình: **đồng hồ hệ thống tại thời điểm phương thức chạy**. Nếu logic nghiệp vụ gọi `Instant.now()` hoặc `LocalDate.now()` trực tiếp ở nhiều nơi, kiểm thử sẽ phụ thuộc thời gian thực và trở nên khó có kết quả xác định.

`Clock` tồn tại để biến nguồn “thời điểm hiện tại” thành một đối tượng có thể truyền vào.
