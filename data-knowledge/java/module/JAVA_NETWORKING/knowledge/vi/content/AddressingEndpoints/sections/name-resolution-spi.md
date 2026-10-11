Java hiện đại cho phép thay resolver hệ thống bằng **InetAddress Resolver SPI** trong package java.net.spi. Đây là điểm mở rộng dành cho hạ tầng hoặc mã thư viện cần kiểm soát cách lookup hostname/IP; ứng dụng thông thường hiếm khi phải tự triển khai.

Hai abstraction chính:

- InetAddressResolver: thực hiện host → address và reverse lookup;
- InetAddressResolverProvider: service provider tạo resolver dùng ở mức JVM.

Mental model:

~~~text
ứng dụng
→ InetAddress API
→ resolver provider được nạp qua service mechanism
→ resolver
→ hệ thống phân giải tên
~~~

Provider tham gia cơ chế service provider của Java. Điều đó cho phép custom resolver hoạt động phía sau API InetAddress mà không buộc ứng dụng thay mọi lời gọi lookup.

JVM duy trì một resolver system-wide cho `InetAddress`. Sau khi VM khởi tạo xong, lần lookup đầu tiên khiến `InetAddress` tìm provider bằng `ServiceLoader` qua system class loader; provider đầu tiên được tìm thấy sẽ cung cấp resolver đó. Nếu không có provider, JDK dùng built-in resolver. Vì vậy custom resolver là hạ tầng ở phạm vi JVM, không phải resolver theo từng request mà mỗi bên gọi tự chọn độc lập.

Thay resolver chỉ đổi **cách phân giải**, không đổi ngữ nghĩa ở tầng ứng dụng: lookup vẫn có thể thất bại, trả nhiều địa chỉ và vẫn là giai đoạn riêng trước connect.

Repo có module Java Version riêng cho lịch sử tính năng này ở Java 18. Networking chỉ sở hữu mô hình tư duy và cách dùng runtime hiện tại; “tính năng được đưa vào release nào” thuộc Java Version.
