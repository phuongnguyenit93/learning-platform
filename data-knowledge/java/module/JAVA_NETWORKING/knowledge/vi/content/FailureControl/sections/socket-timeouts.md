JDK phân timeout theo thao tác thay vì cung cấp một cấu hình chung.

Connect timeout:

~~~java
Socket socket = new Socket();
socket.connect(
        new InetSocketAddress("example.com", 443),
        3_000
);
~~~

Read timeout trên Socket kiểu truyền thống:

~~~java
socket.setSoTimeout(5_000);
int value = socket.getInputStream().read();
~~~

Nếu read tiếp tục block quá thời gian đó, JDK ném SocketTimeoutException nhưng socket không tự động bị đóng chỉ vì SO_TIMEOUT hết hạn.

ServerSocket và DatagramSocket cũng có SO_TIMEOUT cho accept() và receive():

~~~java
serverSocket.setSoTimeout(5_000);
datagramSocket.setSoTimeout(5_000);
~~~

Điểm dễ nhầm: SO_TIMEOUT không phải write timeout tổng quát và cũng không giới hạn DNS lookup. Với HTTP Client còn có client connect timeout và timeout theo từng request ở abstraction khác. Vì vậy timeout phải luôn được đọc cùng API cụ thể đang sử dụng.
