The JDK scopes timeouts to operations instead of exposing one global setting.

Connect timeout:

~~~java
Socket socket = new Socket();
socket.connect(
        new InetSocketAddress("example.com", 443),
        3_000
);
~~~

Read timeout on a classic Socket:

~~~java
socket.setSoTimeout(5_000);
int value = socket.getInputStream().read();
~~~

If the read would block beyond that interval, the JDK throws SocketTimeoutException. SO_TIMEOUT itself does not close the socket merely because it expires.

ServerSocket and DatagramSocket expose the same option for accept() and receive():

~~~java
serverSocket.setSoTimeout(5_000);
datagramSocket.setSoTimeout(5_000);
~~~

A common mistake is to treat SO_TIMEOUT as a universal write or DNS timeout. It is neither. Higher-level APIs such as HttpClient also define time bounds at their own client/request layers, so always interpret a timeout together with the API operation it controls.
