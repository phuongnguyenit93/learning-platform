Java Networking dừng ở **cơ chế client API và hành vi transport**. Khi ứng dụng bắt đầu quan tâm ý nghĩa của request/message, trách nhiệm đã chuyển lên tầng integration.

Với HTTP, Networking sở hữu:

- HttpClient configuration/reuse;
- cơ chế HttpRequest/HttpResponse;
- body publisher/subscriber;
- cơ chế timeout/proxy/authenticator.

Integration sở hữu:

- REST/resource design;
- API contract và status-code policy;
- serialization format/domain schema;
- idempotency/retry semantics;
- service-to-service communication pattern.

Với WebSocket, Networking sở hữu listener, demand, fragmentation và vòng đời send/close. Realtime Integration sở hữu reconnect, subscription/topic model, STOMP/broker semantics và protocol thông điệp của ứng dụng.

Mental handoff:

~~~text
Networking
→ "Java gửi/nhận bằng cơ chế nào?"

Integration
→ "Ứng dụng đang giao tiếp theo contract nào?"
~~~

Giữ ranh giới này giúp module Java Advanced đủ sâu về runtime/API nhưng không lặp lại curriculum Microservice/Integration.
