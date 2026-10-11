Lệnh chẩn đoán chạy với quyền rất gần tiến trình mục tiêu, nên hai câu hỏi luôn đi cùng nhau: **có được phép attach không** và **attach có an toàn tại thời điểm này không**.

Theo tài liệu JDK 21, `jcmd` phải chạy trên cùng máy với JVM đích và thường cần cùng effective user/group identity với tiến trình đã khởi động JVM. Container, PID namespace, security policy và cách đóng gói JRE/JDK có thể làm thay đổi khả năng nhìn thấy hoặc attach vào process.

Trước khi chạy command:

1. Xác nhận đúng PID/instance.
2. Chạy `jcmd <pid> help <command>` để xem lệnh có được hỗ trợ và mức tác động của nó.
3. Kiểm tra đường dẫn đầu ra và quyền ghi nếu lệnh tạo file.
4. Kiểm tra disk/I/O headroom.
5. Xác định symptom có đang ở thời điểm cần bảo toàn trạng thái không.

Ví dụ về mức tác động trong HotSpot JDK 21:

- `VM.flags`: low impact;
- `Thread.print`: medium, phụ thuộc số thread;
- `GC.class_histogram`: high, phụ thuộc heap size/content;
- `GC.heap_dump`: high, phụ thuộc heap size/content và có thể yêu cầu full GC trừ khi dùng option phù hợp.

Nhãn tác động không phải SLA. “Medium” trên JVM vài chục thread khác với JVM có hàng trăm nghìn thread/virtual thread; “high” trên heap 512 MB khác với heap hàng chục GB.

Không nên gửi command rộng tới nhiều JVM chỉ để tiện. `jcmd 0 <command>` có thể gửi command đến tất cả JVM khả dụng; với thao tác nặng, đây là lựa chọn nguy hiểm về vận hành. Hãy nhắm đúng PID.

Cuối cùng, dữ liệu chẩn đoán có thể chứa dữ liệu nhạy cảm: heap dump có object contents, system properties có thể chứa cấu hình, thread stack có thể chứa tên request/task. Quyền đọc, lưu trữ và chia sẻ dữ liệu chẩn đoán phải tuân theo chính sách của hệ thống như bất kỳ dữ liệu production nào khác.
