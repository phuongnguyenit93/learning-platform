InetAddress là abstraction của JDK cho **địa chỉ IP**. Một đối tượng InetAddress biểu diễn địa chỉ IPv4 32-bit hoặc IPv6 128-bit và có thể kèm hostname tương ứng. Trong phần lớn mã nguồn, nên làm việc qua InetAddress thay vì rẽ nhánh trực tiếp theo Inet4Address hay Inet6Address.

Ví dụ:

~~~java
InetAddress address = InetAddress.getByName("example.com");

System.out.println(address.getHostAddress());
System.out.println(address.getHostName());
~~~

Hostname và IP không phải quan hệ một-một. Một hostname có thể được phân giải thành nhiều địa chỉ, vì vậy getAllByName(...) đôi khi phù hợp hơn getByName(...):

~~~java
for (InetAddress address : InetAddress.getAllByName("example.com")) {
    System.out.println(address.getHostAddress());
}
~~~

InetAddress không chứa port. Khi cần địa chỉ transport cụ thể, Java ghép host/IP với port qua InetSocketAddress.

Không nên dùng isReachable() như một health-check tuyệt đối. Kết quả phụ thuộc cấu hình mạng, firewall và cách triển khai. Trạng thái của giao thức ứng dụng nên được kiểm tra bằng tín hiệu ở tầng ứng dụng/protocol phù hợp hơn.
