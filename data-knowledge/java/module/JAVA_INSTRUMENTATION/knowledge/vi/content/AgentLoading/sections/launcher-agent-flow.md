Launcher-Agent-Class phục vụ executable JAR:

~~~text
java -jar application.jar
~~~

Nếu manifest của JAR có:

~~~text
Main-Class: com.example.Main
Launcher-Agent-Class: com.example.agent.BootAgent
~~~

JVM nạp BootAgent và gọi agentmain trước Main.main().

Điểm khác biệt với -javaagent:

- dùng agentmain thay vì premain;
- agentArgs luôn là chuỗi rỗng;
- agent nằm cùng executable JAR;
- lỗi khi agent không khởi động được có thể làm JVM dừng trước main của ứng dụng.

Đây vẫn là **startup agent** dù method tên agentmain. Vì vậy không nên dùng “premain = startup, agentmain = dynamic” như một quy tắc tuyệt đối.
