Nhiều bằng chứng quan trọng chỉ tồn tại trong thời gian ngắn. Restart có thể giải phóng heap, xóa trạng thái lock, kết thúc thread, làm mất ngữ cảnh của crash hoặc ghi đè log. Vì vậy khả năng chẩn đoán phải được chuẩn bị **trước** khi sự cố xảy ra.

Một baseline vận hành tốt thường bao gồm:

- biết chính xác JDK/JVM version và startup flags;
- có chính sách lưu và xoay vòng JVM/log ứng dụng;
- cân nhắc bật GC logging phù hợp với môi trường;
- cấu hình `-XX:+HeapDumpOnOutOfMemoryError` và vị trí lưu bằng `-XX:HeapDumpPath=...` nếu disk budget cho phép;
- cân nhắc JFR chạy liên tục khi cần dữ liệu sự kiện trước thời điểm sự cố;
- bảo đảm người vận hành có quyền chạy công cụ chẩn đoán trên đúng tiến trình;
- biết nơi dữ liệu chẩn đoán được ghi và còn đủ dung lượng;
- đồng bộ timestamp giữa log ứng dụng, JVM log và hệ thống monitoring.

Oracle khuyến nghị chuẩn bị heap dump cho `OutOfMemoryError`, GC logging và flight recording chạy liên tục như một phần của khả năng sẵn sàng troubleshooting. Điều này không có nghĩa mọi JVM trên production phải bật mọi thứ với cùng cấu hình; lựa chọn phải dựa trên chi phí, chính sách dữ liệu và khả năng lưu trữ của hệ thống.

Một checklist nhỏ trước sự cố có giá trị lớn:

```text
JVM nào?
PID/container nào?
JDK tools có sẵn ở đâu?
Ai có quyền attach?
Dữ liệu chẩn đoán ghi vào đâu?
Disk còn bao nhiêu?
Timestamp dùng timezone nào?
Restart sẽ làm mất dữ liệu gì?
```

Sự chuẩn bị trước biến troubleshooting từ phản ứng ngẫu nhiên thành quy trình lặp lại được. Khi sự cố xảy ra, bạn dành thời gian phân tích dữ liệu thay vì đi tìm PID, xin quyền hoặc phát hiện ổ đĩa không đủ để ghi heap dump.
