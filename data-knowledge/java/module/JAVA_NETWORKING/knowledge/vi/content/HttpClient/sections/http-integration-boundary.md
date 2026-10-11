Module Networking sở hữu cách **JDK HTTP Client API hoạt động**: abstraction client/request/response, body streaming, sync/async completion, cấu hình policy, vòng đời kết nối/tài nguyên và Java 21 shutdown semantics.

Nó không sở hữu toàn bộ bài toán HTTP integration của ứng dụng. Khi câu hỏi chuyển thành các quyết định như:

- service A nên retry request nào và theo backoff nào;
- chọn JDK `HttpClient`, Spring `RestClient`/`WebClient`, Feign hay framework khác;
- ánh xạ HTTP status/body thành domain error ra sao;
- circuit breaker, bulkhead, rate limit hoặc observability policy đặt ở đâu;
- OAuth/token refresh/service credentials tổ chức thế nào;
- API contract/versioning và cách điều phối request giữa các service thiết kế ra sao;

thì lộ trình học phải chuyển sang module integration, security hoặc architecture sở hữu nội dung tương ứng.

Ranh giới này giúp dùng JDK API đúng mà không nhầm một cơ chế transport/client với toàn bộ kiến trúc integration:

```text
Networking
    cơ chế JDK HttpClient
          ↓ được sử dụng bởi
HTTP Integration
    mẫu ứng dụng/client + resilience + policy miền nghiệp vụ
```

Hiểu ranh giới cũng giúp tránh abstraction leak theo chiều ngược lại: một framework HTTP client cuối cùng vẫn dựa trên cơ chế mạng/tài nguyên nào đó, nhưng người học không cần học mọi integration pattern để hiểu `HttpClient` của JDK.

Chương kế tiếp vẫn ở cùng họ `java.net.http` nhưng đổi communication model: thay vì các request/response exchange độc lập, WebSocket client của JDK quản lý một kết nối bidirectional message-oriented lâu dài với listener demand, fragmentation, send completion và close/error lifecycle.
