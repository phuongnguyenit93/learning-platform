Socket và Channel là tài nguyên gắn với OS. GC không phải cơ chế quản lý vòng đời phù hợp cho kết nối mạng. Mã nguồn nên có **bên sở hữu rõ ràng** chịu trách nhiệm close.

Với tài nguyên có phạm vi rõ, ưu tiên try-with-resources:

~~~java
try (Socket socket = new Socket("localhost", 8080);
     InputStream in = socket.getInputStream()) {

    // communicate
}
~~~

Đóng Socket sẽ đóng các stream liên quan tới socket đó. Với channel, sau close thì I/O tiếp theo thất bại vì channel không còn open.

Việc dọn dẹp phải chạy cả khi:

- connect xong nhưng protocol setup thất bại;
- read/write ném exception;
- task bị cancel;
- ứng dụng quyết định bỏ request.

Không nên để nhiều tầng cùng “nghĩ mình là bên sở hữu” và cùng điều khiển vòng đời một cách mơ hồ. Ví dụ nếu một thư viện nhận Socket từ bên gọi, contract phải nói rõ thư viện có close socket hay không.

Trách nhiệm sở hữu tài nguyên là điều kiện nền cho cancellation, shutdown và connection reuse ở các chương sau.
