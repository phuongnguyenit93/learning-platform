Không phải mọi thiết lập HTTP nằm cùng một phạm vi. Đặt policy đúng ranh giới giúp tránh cấu hình tưởng là theo từng request nhưng thực tế lại dùng chung toàn client.

| Mối quan tâm | Ranh giới chính trong JDK API | Ý nghĩa |
|---|---|---|
| Preferred HTTP version | `HttpClient.Builder.version(...)`, có thể đặt preferred version trên request | Chọn preference HTTP/1.1 hoặc HTTP/2; server/mạng vẫn tham gia negotiation thực tế |
| Redirect | `HttpClient.Builder.followRedirects(...)` | Policy `NEVER`, `NORMAL`, `ALWAYS` cho client |
| Connect timeout | `HttpClient.Builder.connectTimeout(...)` | Giới hạn thời gian thiết lập kết nối |
| Request timeout | `HttpRequest.Builder.timeout(...)` | Timeout gắn với request cụ thể |
| Proxy | `HttpClient.Builder.proxy(...)` | `ProxySelector` cấp client |
| Authentication | `HttpClient.Builder.authenticator(...)` | `Authenticator` cấp client cho HTTP authentication challenge |
| Cookies | `HttpClient.Builder.cookieHandler(...)` | `CookieHandler` dùng chung cho các request của client |
| Async executor | `HttpClient.Builder.executor(...)` | Executor cho công việc bất đồng bộ/phụ thuộc của client; nếu không đặt, cách triển khai vẫn có executor mặc định nội bộ |

Request còn sở hữu URI, method, headers và body. Policy của client là nền cấu hình dùng chung; request là một trao đổi cụ thể.

Các thiết lập này mô tả **cơ chế HTTP của JDK**. Quyết định cấp integration như retry policy theo method/status, circuit breaker, service discovery, OAuth flow, domain error mapping hoặc chọn HTTP client framework thuộc module integration/security tương ứng.
