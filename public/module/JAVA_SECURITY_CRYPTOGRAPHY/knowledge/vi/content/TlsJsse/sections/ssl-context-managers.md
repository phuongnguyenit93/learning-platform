`SSLContext` là factory và nơi giữ trạng thái cấu hình cho phần triển khai giao thức bảo mật. Nó được khởi tạo bằng `KeyManager[]`, `TrustManager[]` và `SecureRandom`.

~~~java
SSLContext context = SSLContext.getInstance("TLS");
context.init(keyManagers, trustManagers, secureRandom);
~~~

**KeyManager** chọn thông tin xác thực cục bộ để trình bày với peer. **TrustManager** quyết định thông tin xác thực của remote peer có được tin cậy hay không.

Hai vai trò này không đơn giản là “một cái cho client, một cái cho server”. Với mutual TLS, cả hai phía đều có thể vừa trình bày danh tính vừa kiểm tra peer.

Với `null`, cần tách **contract của Java SE API** khỏi behavior mà Oracle JSSE guide mô tả cho JDK:

- ở mức `SSLContext.init(...)` API contract, nếu `KeyManager[]` hoặc `TrustManager[]` là `null`, runtime sẽ tìm implementation ưu tiên cao của factory tương ứng từ các security provider đã cài đặt; `SecureRandom == null` cho phép dùng implementation mặc định;
- trong Oracle JSSE Reference Guide cho JDK, `KeyManager[] == null` được mô tả là tạo một empty `KeyManager` cho context, còn `TrustManager[] == null` dùng default `TrustManagerFactory` để lấy `TrustManager` thích hợp.

Vì vậy không nên suy một quy tắc “mọi `null` đều giống nhau”, cũng không được hiểu `null` là vô hiệu hóa certificate/trust validation. Khi code phụ thuộc vào default resolution, hãy kiểm tra behavior của provider/JDK đang triển khai.
