Platform MBeanServer là registry MBean tích hợp trong JVM. Lấy bằng:

~~~java
MBeanServer server = ManagementFactory.getPlatformMBeanServer();
~~~

Ba cách truy cập platform MXBeans phổ biến:

1. trực tiếp qua ManagementFactory trong cùng JVM;
2. qua MXBean proxy trên MBeanServerConnection;
3. gián tiếp qua MBeanServer/MBeanServerConnection và ObjectName.

Ví dụ direct:

~~~java
RuntimeMXBean runtime = ManagementFactory.getRuntimeMXBean();
System.out.println(runtime.getUptime());
~~~

Proxy hữu ích khi mã muốn giữ interface có type rõ ràng nhưng JVM đích có thể ở xa.

MBeanServer cũng cho ứng dụng đăng ký MBean riêng. Phần custom instrumentation đó thuộc thiết kế JMX rộng hơn; module này chỉ đi đủ sâu để hiểu đường truy cập phục vụ chẩn đoán.
