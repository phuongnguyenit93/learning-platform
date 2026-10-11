Không phải mọi câu hỏi runtime đều cần quyền truy cập shell hoặc dump file. Java cung cấp một **management API** chuẩn để ứng dụng hoặc client quản lý đọc trạng thái JVM qua các interface ổn định.

Mục tiêu của lớp này là:

- cung cấp trạng thái runtime dưới dạng managed object;
- cho phép đọc metric/trạng thái ngay trong tiến trình hoặc từ xa;
- hỗ trợ một số thao tác quản lý;
- tách client quản lý khỏi class triển khai cụ thể của JVM.

Mental model:

~~~text
JVM/runtime component
        ↓
platform MXBean / MBean
        ↓
MBeanServer / proxy / direct access
        ↓
mã ứng dụng, JConsole, JMC hoặc client quản lý
~~~

Trong Runtime Diagnostics, JMX/MXBeans là **nguồn bằng chứng runtime có cấu trúc**. Chúng không thay thế thread dump, JFR hay heap dump; chúng cung cấp một kênh quan sát liên tục và có thể truy cập bằng mã.
