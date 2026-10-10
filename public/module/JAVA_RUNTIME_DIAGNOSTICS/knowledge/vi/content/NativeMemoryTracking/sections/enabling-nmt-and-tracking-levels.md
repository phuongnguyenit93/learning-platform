NMT **tắt mặc định** và phải được bật khi JVM khởi động:

~~~text
-XX:NativeMemoryTracking=summary
~~~

hoặc:

~~~text
-XX:NativeMemoryTracking=detail
~~~

Hai mức:

- **summary**: tổng hợp theo subsystem/category, thường đủ để theo dõi xu hướng trên production;
- **detail**: thêm thông tin theo call site và bản đồ virtual memory, hữu ích khi cần đi sâu nhưng tốn thêm chi phí và dữ liệu.

Sau khi JVM chạy, dùng jcmd:

~~~text
jcmd <pid> VM.native_memory summary
jcmd <pid> VM.native_memory detail
~~~

NMT chỉ có thể được bật bằng tùy chọn JVM khi khởi động. `jcmd` có thể **dừng** NMT bằng `VM.native_memory shutdown`, nhưng không thể start hoặc restart NMT trong JVM đang chạy; sau khi đã shutdown, muốn bật lại phải khởi động lại JVM với NMT được cấu hình từ đầu.

Chọn detail chỉ khi câu hỏi cần mức chi tiết đó; summary thường là điểm bắt đầu thực dụng hơn.
