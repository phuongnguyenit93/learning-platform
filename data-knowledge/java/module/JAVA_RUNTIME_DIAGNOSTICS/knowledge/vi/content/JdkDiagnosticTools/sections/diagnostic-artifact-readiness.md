Mức sẵn sàng chẩn đoán ở cấp công cụ nghĩa là **dữ liệu chẩn đoán có thể được tạo đúng lúc, đúng nơi và còn dùng được sau sự cố**.

Một cấu hình thực tế cần quyết định trước:

- thư mục dành riêng cho diagnostic artifacts;
- dung lượng tối đa và cơ chế dọn dẹp/giữ dữ liệu;
- quyền ghi của tiến trình JVM;
- quy ước filename có service, instance, PID và timestamp;
- GC log rotation;
- nơi lưu heap dump khi `OutOfMemoryError`;
- continuous recording policy nếu sử dụng JFR;
- cách chuyển dữ liệu lớn khỏi host mà không làm nghẽn disk/network trong sự cố.

Ví dụ startup options:

```text
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/var/log/myapp/heapdump.hprof
-Xlog:gc*:file=/var/log/myapp/gc.log:time,uptime,level,tags:filecount=5,filesize=20M
```

Đây chỉ là ví dụ hình dạng cấu hình; đường dẫn và chính sách giữ dữ liệu phải phù hợp môi trường. Nếu nhiều JVM cùng ghi vào một tên file cố định, bạn còn phải tránh collision.

Heap dump đặc biệt cần được lên kế hoạch. `GC.heap_dump` được Oracle đánh dấu high impact và file có thể rất lớn. Trước khi chạy, kiểm tra:

```text
disk free
→ đường dẫn đầu ra
→ quyền truy cập
→ có chấp nhận tác động pause/I/O không
→ dữ liệu sẽ được bảo vệ/chuyển đi thế nào
```

GC logs và JFR có giá trị vì chúng tạo **history trước sự cố**, trong khi thread dump/histogram thường được chụp sau khi symptom đã xuất hiện.

Sẵn sàng chẩn đoán không phải bật mọi tùy chọn. Mục tiêu là có tối thiểu bộ bằng chứng phù hợp với dạng lỗi quan trọng của hệ thống và biết chính xác cách thu thập thêm khi cần.
