Không nên dùng Instrumentation khi có cơ chế đơn giản và rõ hơn.

Ví dụ:

- ứng dụng sở hữu mã nguồn và chỉ cần số liệu đo cho vài method → viết decorator/interceptor rõ ràng có thể dễ hơn;
- lời gọi Spring bean cần AOP → proxy/AOP của framework thường phù hợp hơn;
- chỉ cần đọc annotation/metadata → Reflection;
- cần chẩn đoán GC/thread/heap → JFR/jcmd/Runtime Diagnostics;
- cần thay đổi cấu trúc object/quan hệ kế thừa tùy ý → redefine/retransform không đủ;
- cần sự kiện VM native ở mức sâu → chuyển sang ranh giới JVMTI/native agent.

Phản mẫu:

~~~text
"Không muốn sửa code"
→ dùng bytecode agent cho mọi thứ
~~~

Độ phức tạp ẩn gồm vấn đề ClassLoader, khả năng tương thích JDK, overhead khi khởi động và khó gỡ lỗi. Instrumentation nên là **lựa chọn hạ tầng có chủ đích**, không phải lối tắt mặc định.
