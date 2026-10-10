Ngữ nghĩa khi xảy ra lỗi khác nhau theo đường khởi động:

| Đường khởi động | Lỗi khởi tạo agent |
| --- | --- |
| -javaagent / premain | JVM dừng trước main của ứng dụng |
| Launcher-Agent-Class | JVM dừng trước main của ứng dụng |
| JVM đang chạy / agentmain | JVM mục tiêu không bị dừng; lỗi có thể bị bỏ qua/ghi log |

Điều này ảnh hưởng cách thiết kế:

- startup agent có thể dừng sớm khi lỗi nếu instrumentation bắt buộc;
- dynamic agent phải báo trạng thái về công cụ/người vận hành vì ứng dụng mục tiêu vẫn tiếp tục;
- quá trình khởi tạo nên idempotent hoặc có guard nếu công cụ có thể attach nhiều lần;
- agent cần dọn phần trạng thái đã tạo nếu khởi tạo thất bại giữa chừng.

Đừng dùng cùng một chiến lược xử lý lỗi cho cả premain và agentmain mà không xét đường khởi động.
