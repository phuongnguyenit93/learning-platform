Không phải mọi dữ liệu chẩn đoán đều được phân tích ngay trên JVM đang gặp sự cố. Có ba cách làm thường gặp:

**1. Live diagnostics**

Bạn hỏi trực tiếp JVM đang chạy và nhận đầu ra tức thời:

```bash
jcmd 12345 VM.flags
jcmd 12345 Thread.print -l
jcmd 12345 GC.heap_info
jstat -gcutil 12345 1000 10
```

Ưu điểm là phản ánh trạng thái hiện tại. Nhược điểm là trạng thái có thể đổi nhanh và một số thao tác có tác động đáng kể.

**2. Thu thập dữ liệu để phân tích sau**

Bạn yêu cầu JVM ghi dữ liệu ra file:

```bash
jcmd 12345 GC.heap_dump /diagnostics/heap.hprof
jcmd 12345 Thread.dump_to_file -format=json /diagnostics/threads.json
jcmd 12345 JFR.dump filename=/diagnostics/incident.jfr
```

Dữ liệu có thể được chuyển sang máy phân tích, lưu cùng ticket sự cố hoặc so sánh về sau. Cần bảo vệ vì heap dump/recording có thể chứa dữ liệu ứng dụng nhạy cảm.

**3. Bằng chứng postmortem**

Khi JVM đã dừng, các lệnh chẩn đoán trực tiếp không còn dùng được. Khi đó phải dựa vào dữ liệu đã tồn tại: fatal error log, core dump, heap dump, GC/application logs và JFR recording. Quy trình này được đi sâu ở chương Crash/Postmortem Diagnostics.

Điểm kết nối giữa ba cách làm là **thời gian**. Nếu sự cố chỉ kéo dài 30 giây, một heap dump lấy 10 phút sau có thể mô tả trạng thái khác hoàn toàn. Hãy ghi timestamp, PID, định danh host/container và khoảng thời gian xảy ra triệu chứng cho mỗi dữ liệu.

Trước khi restart một JVM, hãy hỏi:

```text
Dữ liệu nào chỉ còn tồn tại trong tiến trình hiện tại?
Dữ liệu nào đã được ghi bền vững?
Restart sẽ xóa bằng chứng nào?
```

Trong sự cố thực tế, khả năng bảo toàn bằng chứng thường quan trọng không kém khả năng đọc đầu ra của công cụ.
