Chẩn đoán runtime là quá trình quan sát một JVM đang chạy hoặc các dữ liệu chẩn đoán mà JVM để lại để trả lời một câu hỏi cụ thể về sự cố. Mục tiêu không phải là “chạy càng nhiều công cụ càng tốt”, mà là biến một triệu chứng bên ngoài thành bằng chứng đủ mạnh để kiểm chứng một giả thuyết.

Ví dụ, các biểu hiện sau mới chỉ là **triệu chứng**:

- API chậm bất thường;
- tiến trình dùng nhiều CPU;
- bộ nhớ của tiến trình tăng liên tục;
- request bị treo;
- xuất hiện `OutOfMemoryError`;
- JVM crash.

Mỗi triệu chứng có nhiều nguyên nhân khả dĩ. API chậm có thể do thread bị block, lock contention, GC pause, I/O, database hoặc đoạn mã đang chạy nóng. Vì vậy chẩn đoán runtime tập trung vào câu hỏi:

```text
Triệu chứng
    ↓
Điều gì đang xảy ra trong JVM?
    ↓
Bằng chứng nào có thể quan sát được?
    ↓
Giả thuyết nào phù hợp với bằng chứng?
    ↓
Cần thêm dữ liệu gì để xác nhận hoặc bác bỏ?
```

Trong module này, “bằng chứng” có thể là thread dump, class histogram, heap dump, GC log, JFR recording, đầu ra của Native Memory Tracking, dữ liệu MXBean/JMX hoặc dữ liệu crash. Mỗi loại chỉ nhìn thấy một phần runtime; không có nguồn dữ liệu đơn lẻ nào giải thích được mọi sự cố.

Điểm quan trọng là tách **cơ chế** khỏi **chẩn đoán**. Module JVM giải thích heap, GC, JIT và quá trình thực thi runtime hoạt động thế nào. Module Concurrency giải thích synchronization, happens-before và tính đúng đắn. Runtime Diagnostics dùng những mô hình đó để diễn giải dữ liệu quan sát được khi hệ thống có vấn đề.

Khi học xong module, bạn nên có khả năng bắt đầu từ một triệu chứng, chọn loại bằng chứng phù hợp, thu thập nó với chi phí hợp lý, rồi xây dựng kết luận có thể kiểm chứng thay vì đoán từ cảm giác.
