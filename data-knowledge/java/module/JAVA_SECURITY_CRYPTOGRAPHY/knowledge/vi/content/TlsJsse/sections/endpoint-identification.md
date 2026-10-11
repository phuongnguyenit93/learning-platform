Certificate path được tin cậy vẫn chưa đủ; client còn phải kiểm tra **endpoint identity**.

`SSLParameters` cho phép cấu hình endpoint identification algorithm trong các API JSSE thích hợp. Ví dụ với một `SSLSocket` client dùng HTTPS-style hostname verification:

~~~java
SSLParameters parameters = socket.getSSLParameters();
parameters.setEndpointIdentificationAlgorithm("HTTPS");
socket.setSSLParameters(parameters);
~~~

Khi algorithm khác `null`/rỗng, endpoint identification phải được xử lý trong TLS handshake. HTTP client stack cấp cao thường cấu hình hostname verification theo quy tắc HTTPS cho trường hợp sử dụng của nó.

SNI và endpoint verification có liên quan nhưng không giống nhau: SNI giúp client nói server name mong muốn trong handshake; verification kiểm tra identity mà peer certificate trình bày có khớp target hay không.

Không dùng TrustManager “trust all” hoặc tắt hostname verification làm workaround môi trường thực tế. Nếu dev/test dùng certificate tự ký, hãy tạo trust material test rõ ràng thay vì vô hiệu hóa security check toàn cục.
