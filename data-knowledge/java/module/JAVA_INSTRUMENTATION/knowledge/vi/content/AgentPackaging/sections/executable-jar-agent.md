Executable JAR có thể vừa chứa class main của ứng dụng vừa chứa Java agent. Launcher-Agent-Class cho JVM biết agent nào cần được gọi **trước main của ứng dụng**.

Ví dụ manifest:

~~~text
Main-Class: com.example.app.Main
Launcher-Agent-Class: com.example.agent.BootAgent
~~~

JVM gọi:

~~~java
public static void agentmain(String agentArgs, Instrumentation inst)
~~~

trước khi gọi main của ứng dụng. Với đường khởi động này, agentArgs là chuỗi rỗng.

Trường hợp sử dụng phù hợp là ứng dụng muốn tự đóng gói agent bootstrap mà không yêu cầu người vận hành thêm -javaagent. Tuy nhiên mức gắn kết triển khai tăng lên: artifact ứng dụng giờ mang luôn một thành phần runtime có đặc quyền. Cần rà soát độ tin cậy, quản lý phiên bản và cách xử lý lỗi như một phần của đường khởi động.
