Đối với lỗi thiếu Java heap, cách chuẩn bị quan trọng là bật:

~~~text
-XX:+HeapDumpOnOutOfMemoryError
~~~

Khi JVM gặp `OutOfMemoryError` thuộc trường hợp có thể tạo heap dump, HotSpot sẽ ghi file HPROF mà không cần người vận hành kịp attach vào tiến trình. Có thể kiểm soát vị trí bằng `-XX:HeapDumpPath`.

Ví dụ trên shell Linux/macOS:

~~~text
java -XX:+HeapDumpOnOutOfMemoryError \
     -XX:HeapDumpPath=/var/log/java/app-%p.hprof \
     -jar app.jar
~~~

Điểm quan trọng là **thu thập** và **phân tích** là hai trách nhiệm khác nhau:

- chapter Postmortem sở hữu việc chuẩn bị và bảo toàn heap dump khi OOME;
- chapter Heap/GC sở hữu cách đọc histogram/heap dump để kiểm tra xu hướng tăng bộ nhớ hoặc giả thuyết leak.

Heap dump có thể rất lớn và việc ghi file có thể tạo pause đáng kể. Cần đảm bảo đủ dung lượng đĩa, đường dẫn có quyền ghi và quy trình bảo vệ dữ liệu nhạy cảm trong heap.
