Với agent khởi động cùng JVM được truyền qua dòng lệnh:

~~~text
java -javaagent:timing-agent.jar=config=prod app.Main
~~~

JVM đọc Premain-Class từ manifest, nạp agent class và gọi premain **trước main của ứng dụng**.

~~~java
public static void premain(String agentArgs, Instrumentation inst) {
    inst.addTransformer(new TimingTransformer());
}
~~~

Nếu có nhiều option -javaagent, premain được gọi theo thứ tự xuất hiện trên dòng lệnh. Điều này có thể ảnh hưởng thứ tự đăng ký transformer và dependency giữa các agent.

Ưu điểm của startup agent là triển khai có tính xác định: agent có mặt từ đầu và có thể thấy những class ứng dụng được nạp sau đó. Nhược điểm là cấu hình triển khai phải thay đổi và lỗi khởi động agent có thể làm JVM dừng trước khi main của ứng dụng chạy.
