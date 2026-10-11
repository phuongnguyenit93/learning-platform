Dynamic attach thay đổi một JVM **sau khi triển khai đã khởi động**, nên chính sách phải rõ hơn startup agent.

JDK 21 phát cảnh báo cho dynamic agent loading theo hướng của JEP 451. Điều này phản ánh nguyên tắc bảo toàn tính toàn vẹn:

~~~text
startup -javaagent
→ người triển khai đã opt-in trước khi ứng dụng chạy

dynamic attach
→ thay đổi runtime theo nhu cầu
→ cần quyền cho phép rõ ràng
~~~

Chính sách production nên xác định:

- ai/công cụ nào được attach;
- môi trường nào cho phép;
- cảnh báo/kiểm toán khi attach;
- flag JVM được cấu hình ra sao;
- phương án dự phòng khi JDK tương lai siết mặc định.

Không xây tự động hóa phụ thuộc vào việc dynamic attach “chắc chắn luôn bật” ở mọi JDK tương lai.
