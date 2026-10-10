Ba mô hình đều hợp lệ; quyết định nên bắt đầu từ **semantics và mức kiểm soát cần thiết**, không từ giả định "NIO luôn nhanh hơn".

| Mô hình | Khi phù hợp | Chi phí thiết kế cần chấp nhận |
|---|---|---|
| Blocking socket/channel + thread/virtual thread per task | Luồng request/kết nối tuần tự, mã dễ đọc; Java 21 virtual threads cho phép concurrency lớn hơn với kiểu blocking | Vẫn cần giới hạn tài nguyên, timeout/cancellation và không được tạo tải vô hạn cho hệ thống phía sau |
| Non-blocking `SelectableChannel` + `Selector` | Cần một hoặc vài event-loop thread multiplex nhiều channel, kiểm soát readiness và buffer/trạng thái đang chờ trực tiếp | Phải tự quản state machine, partial I/O, interest ops, fairness và vòng đời |
| `Asynchronous*Channel` | Hệ thống tích hợp tự nhiên với completion callback/Future hoặc muốn API theo completion của thao tác | Trạng thái callback/completion, quy tắc thao tác đang chờ và vòng đời channel group phức tạp hơn |

Một quy tắc thực tế:

```text
luồng blocking đáp ứng được yêu cầu
        ↓
giữ blocking model đơn giản, cân nhắc virtual threads trên Java 21

cần explicit readiness multiplexing
        ↓
Selector + non-blocking channels

cần completion-oriented API
        ↓
Asynchronous channels
```

Không mô hình nào tự giải quyết framing cấp ứng dụng, chính sách backpressure, admission control hay tính đúng đắn của concurrency. NIO cung cấp cơ chế I/O; các chính sách cấp ứng dụng vẫn phải được thiết kế ở module sở hữu phù hợp.

Sau khi đã hiểu ba mô hình I/O cấp thấp, chương tiếp theo chuyển lên abstraction cao hơn là JDK HttpClient để thấy cách HTTP che phần lớn socket/channel mechanics nhưng vẫn giữ những concern về completion, timeout và vòng đời tài nguyên.
