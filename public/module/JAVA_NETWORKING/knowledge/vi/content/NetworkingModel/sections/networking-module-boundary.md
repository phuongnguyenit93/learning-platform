Module này sở hữu **JDK networking APIs và cơ chế vận hành runtime ở phía ứng dụng Java**:

- biểu diễn địa chỉ và phân giải tên;
- TCP/UDP sockets;
- socket options, timeout, lỗi và vòng đời tài nguyên;
- NIO network channels, selector và asynchronous channels;
- JDK HttpClient và WebSocket client;
- cách chọn abstraction mạng phù hợp.

Một số chủ đề xuất hiện để làm rõ ranh giới nhưng không được đào sâu ở đây:

- TLS/JSSE, certificate, key material → Security & Cryptography;
- thread scheduling, executors, virtual-thread model → Concurrency;
- HTTP API design, REST convention, retry/resilience policy → Integration / Resilience;
- WebSocket protocol architecture, reconnect policy, STOMP/messaging semantics → Realtime Integration;
- gateway, proxy architecture, service mesh, routing hạ tầng → Infrastructure / Network.

Ranh giới này tránh một lỗi học phổ biến: thấy một HTTPS request có TLS, retry và JSON rồi gom tất cả thành “Java Networking”. Networking giải thích cơ chế kết nối/API; các mối quan tâm còn lại có module sở hữu riêng.

Sau chương mở đầu này, người học nên hiểu mình sẽ đi theo luồng: **endpoint → transport → lỗi/vòng đời → mô hình NIO → HTTP/WebSocket → lựa chọn và đánh đổi**.
