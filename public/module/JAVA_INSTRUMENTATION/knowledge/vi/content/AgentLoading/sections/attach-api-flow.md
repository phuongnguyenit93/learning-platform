Module jdk.attach cung cấp API để công cụ kết nối tới JVM khác và yêu cầu thao tác như nạp agent. Mô hình tư duy:

~~~text
tiến trình công cụ chẩn đoán
        ↓
VirtualMachine.attach(target)
        ↓
yêu cầu nạp agent
        ↓
JVM mục tiêu nạp agent JAR
        ↓
Agent-Class.agentmain(...)
~~~

Attach API là **ranh giới công cụ**, không phải một phần của package java.lang.instrument. java.lang.instrument định nghĩa vòng đời agent; jdk.attach là một cơ chế JDK có thể được dùng để khởi động vòng đời đó trong JVM đang chạy.

Attach có thể bị giới hạn bởi quyền của hệ điều hành/người dùng, option JVM, môi trường container/tiến trình hoặc chính sách của hiện thực JVM. Vì vậy code không nên giả định “biết PID là attach được”.

Khi xây công cụ cho môi trường production, hãy tách hai miền lỗi: lỗi attach ở tiến trình công cụ và lỗi khởi tạo agent bên JVM mục tiêu.
