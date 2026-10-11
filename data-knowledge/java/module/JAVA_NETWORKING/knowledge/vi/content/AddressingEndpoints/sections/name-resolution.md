Khi mã nguồn dùng hostname, hệ thống phải biến tên đó thành một hoặc nhiều địa chỉ IP. InetAddress.getByName(...) có thể thực hiện name resolution và có thể thất bại với UnknownHostException.

Name resolution là I/O phụ thuộc hệ thống, không phải phép biến đổi chuỗi thuần túy:

~~~text
hostname
   ↓
resolver được JVM/platform sử dụng
   ↓
one or more IP addresses
~~~

JDK có cơ chế cache kết quả lookup thành công và thất bại theo các cấu hình networking/security liên quan. Vì vậy thay đổi DNS bên ngoài không đảm bảo một JVM đang chạy sẽ thấy kết quả mới ngay lập tức.

Một điểm phân biệt quan trọng: core InetAddress lookup API không có tham số timeout cho từng lần getByName(). Đừng lấy socket connect timeout rồi giả định nó cũng giới hạn DNS lookup; resolution và connect là hai giai đoạn khác nhau.

Phân loại lỗi theo giai đoạn:

- phân giải thất bại → thường là UnknownHostException;
- phân giải thành công nhưng connect thất bại → ConnectException, timeout hoặc lỗi transport khác;
- phân giải ra nhiều IP → endpoint thực tế phụ thuộc địa chỉ nào được thử.

Khi troubleshoot, log hostname **và** địa chỉ đã phân giải giúp biết lỗi nằm trước hay sau bước resolution.

Resolution cũng có thể xảy ra theo chiều ngược lại. Nếu một `InetAddress` chỉ được tạo từ địa chỉ IP, `getHostName()` có thể thực hiện reverse name lookup; `getCanonicalHostName()` là best-effort lookup để tìm fully qualified host name. Điểm này quan trọng trong luồng logging/diagnostic vì một method trông giống thao tác định dạng đơn giản vẫn có thể đi qua resolver boundary. Khi mã nguồn chỉ cần giữ nguyên chuỗi host của `InetSocketAddress`, `getHostString()` tránh kích hoạt reverse lookup.
