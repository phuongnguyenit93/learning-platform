# Quản lý vòng đời tài nguyên và an toàn khi lỗi

Một `byte[]` hoặc `String` thông thường sống trong bộ nhớ do JVM quản lý. Stream, channel, `DirectoryStream` hay `FileLock` thì khác: chúng thường đại diện cho một **tài nguyên bên ngoài** như file descriptor (định danh của hệ điều hành cho một tài nguyên I/O đang mở như tệp, socket hoặc pipe) hoặc một **handle gốc (native handle)** tương đương do nền tảng cung cấp.

Vì vậy vòng đời I/O không thể dựa vào suy nghĩ “không còn tham chiếu thì GC sẽ lo”. GC quản lý bộ nhớ Java; mã vẫn cần đóng tài nguyên I/O một cách xác định.

~~~text
mở tài nguyên
→ sử dụng
→ đóng/giải phóng

phải đúng cả khi:
→ thành công
→ return sớm
→ có ngoại lệ
~~~
