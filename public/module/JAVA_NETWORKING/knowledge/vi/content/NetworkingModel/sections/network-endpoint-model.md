Một endpoint mạng cần đủ thông tin để định vị **một đầu giao tiếp**. Với Internet socket, mô hình tư duy phổ biến là:

~~~text
host/IP + port
~~~

Host name như <code>example.com</code> là tên logic dễ dùng. Tên này thường phải được phân giải thành một hoặc nhiều địa chỉ IP. Port xác định endpoint ở tầng transport trên máy đích; cùng một IP có thể phục vụ nhiều tiến trình hoặc dịch vụ qua các port khác nhau.

Java tách các lớp thông tin này thành những abstraction riêng:

- InetAddress: địa chỉ IP, có thể kèm hostname;
- InetSocketAddress: địa chỉ socket kiểu IP/host + port;
- SocketAddress: abstraction chung cho địa chỉ socket;
- UnixDomainSocketAddress: endpoint local theo pathname cho Unix-domain socket.

Không nên đồng nhất URL với endpoint. URL còn có scheme, path, query và ngữ nghĩa của tài nguyên. Ví dụ <code>https://example.com/orders?id=42</code> chứa nhiều thông tin hơn địa chỉ socket mà kết nối cuối cùng sử dụng.

Điểm phân biệt này là nền cho các chương sau: name resolution biến tên thành địa chỉ; TCP/UDP dùng endpoint để truyền dữ liệu; HTTP/WebSocket lại xây abstraction mức cao hơn trên kết nối đó.
