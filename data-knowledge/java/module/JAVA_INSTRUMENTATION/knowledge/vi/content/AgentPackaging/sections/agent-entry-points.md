Ba attribute chọn agent class cho ba đường khởi động:

- **Premain-Class**: dùng với -javaagent, JVM gọi premain trước main của ứng dụng.
- **Agent-Class**: dùng khi agent được nạp vào JVM đang chạy, JVM gọi agentmain.
- **Launcher-Agent-Class**: agent đóng gói trong executable JAR, JVM gọi agentmain trước main của ứng dụng.

Một agent JAR có thể chứa cả Premain-Class và Agent-Class để hỗ trợ cả khởi động cùng JVM lẫn nạp động.

Ví dụ:

~~~text
Manifest-Version: 1.0
Premain-Class: com.example.agent.TimingAgent
Agent-Class: com.example.agent.TimingAgent
Can-Retransform-Classes: true
~~~

Điểm dễ nhầm: Launcher-Agent-Class cũng dùng agentmain, nhưng không phải dynamic attach. Nó chạy trong luồng khởi động của executable JAR.
