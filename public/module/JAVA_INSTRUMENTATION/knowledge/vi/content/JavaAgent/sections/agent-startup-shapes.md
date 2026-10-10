Có ba hình thức cần phân biệt:

| Hình thức | Manifest | Entry point | Thời điểm |
| --- | --- | --- | --- |
| command-line agent | Premain-Class | premain | trước main của ứng dụng |
| executable-JAR agent | Launcher-Agent-Class | agentmain | trước main của ứng dụng |
| dynamic agent | Agent-Class | agentmain | sau khi JVM đã chạy |

Hai hình thức đầu là **startup-time**: triển khai chủ động khai báo agent trước khi ứng dụng chạy. Dynamic agent cần JVM/hiện thực hỗ trợ cơ chế attach/nạp động và chịu chính sách ngày càng chặt của JDK.

Việc cả Launcher-Agent-Class và dynamic agent đều gọi agentmain không có nghĩa chúng giống nhau về cách xử lý lỗi hoặc agentArgs. Luôn suy luận từ **đường khởi động**, không chỉ từ tên method.
