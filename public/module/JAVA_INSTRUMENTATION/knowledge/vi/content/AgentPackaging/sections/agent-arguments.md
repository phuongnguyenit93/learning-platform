Với -javaagent, phần sau dấu bằng được chuyển cho premain dưới dạng **một String duy nhất**:

~~~text
java -javaagent:timing-agent.jar=include=com.example,debug=true app.jar
~~~

Agent tự quyết định định dạng và cách phân tích:

~~~java
public static void premain(String agentArgs, Instrumentation inst) {
    AgentConfig config = AgentConfig.parse(agentArgs);
}
~~~

Không nên coi agentArgs là một định dạng cấu hình chuẩn của Java. Nó chỉ là chuỗi truyền tải. Trong môi trường production, bộ phân tích nên:

- kiểm tra hợp lệ key/value rõ ràng;
- có mặc định an toàn;
- không ghi log bí mật;
- báo lỗi với thông báo hữu ích khi cấu hình sai;
- tránh phụ thuộc vào thư mục làm việc nếu nhận đường dẫn.

Với Launcher-Agent-Class, đặc tả package quy định agentArgs là chuỗi rỗng. Đây là khác biệt cần nhớ khi tái sử dụng cùng một agentmain.
