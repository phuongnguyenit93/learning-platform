Bước đầu tiên của mọi thao tác chẩn đoán là chắc chắn bạn đang nhìn **đúng JVM**. Một host có thể chạy nhiều tiến trình Java, một container có thể có PID namespace riêng, và tên main class/JAR đôi khi giống nhau giữa nhiều instance.

Có thể bắt đầu bằng:

```bash
jcmd -l
```

hoặc:

```bash
jps -lv
```

`jcmd -l` liệt kê các JVM mà công cụ có thể nhìn thấy cùng main class và thông tin command line. `jps` cung cấp cách liệt kê tương tự cho HotSpot JVM. Tuy nhiên, không nên xem danh sách này là nguồn nhận dạng duy nhất. Oracle lưu ý rằng JVM nằm trong một Docker process/namespace riêng có thể không xuất hiện theo cách bạn mong đợi; khi đó cần kết hợp công cụ hệ điều hành/container để tìm đúng PID.

Sau khi có PID nghi ngờ, hãy kiểm tra định danh của JVM đích:

```bash
jcmd 12345 VM.version
jcmd 12345 VM.command_line
jcmd 12345 VM.flags
jcmd 12345 VM.system_properties
```

Các câu hỏi cần trả lời trước khi thu thập dữ liệu nặng:

- đây có đúng instance/service không;
- JDK version/vendor nào đang chạy;
- startup command và JVM flags có đúng với deployment bạn đang điều tra không;
- PID đang dùng là PID của host hay PID trong container;
- tiến trình đã restart chưa, vì restart có thể đổi PID và làm mất trạng thái sự cố.

Trong môi trường orchestrated, nên liên kết PID với **service instance + container/pod + host + thời điểm**. Một file tên `thread-dump-12345.txt` thiếu timestamp và định danh instance rất dễ bị phân tích nhầm sau sự cố.

Ví dụ naming tốt hơn:

```text
orders-api_pod-7f9c_pid-12345_2026-10-02T08-15-30Z_threads.txt
```

Nhận diện đúng JVM đích là bước có chi phí gần như bằng không nhưng có giá trị rất lớn: toàn bộ phân tích sau đó đều vô nghĩa nếu dữ liệu đến từ sai JVM.
