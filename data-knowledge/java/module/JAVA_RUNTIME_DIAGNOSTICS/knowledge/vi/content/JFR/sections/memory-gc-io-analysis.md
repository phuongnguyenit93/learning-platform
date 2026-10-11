JFR cũng kết nối ba câu hỏi thường tách rời: **allocation → GC → I/O**.

Với memory:

- allocation events cho biết chuỗi lời gọi tạo object;
- GC events cho biết hành vi pause/collection theo dòng thời gian;
- old-object sampling có thể hỗ trợ leak investigation khi được cấu hình phù hợp.

Với I/O:

- file/socket read/write events có thể cho thời lượng và ngữ cảnh;
- đối chiếu I/O event với thread park hoặc request latency để xem thời gian bị tiêu ở đâu.

Đừng nhầm tốc độ cấp phát cao với memory leak. Ứng dụng có thể cấp phát nhanh nhưng GC thu hồi tốt. Giả thuyết leak cần bằng chứng về việc giữ object và xu hướng theo thời gian.

Tương tự, GC event dày đặc là tín hiệu cần phân tích JVM/heap thêm; JFR không thay thế hiểu biết về cơ chế collector.
