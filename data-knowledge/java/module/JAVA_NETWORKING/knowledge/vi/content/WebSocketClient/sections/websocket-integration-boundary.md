Chương Networking sở hữu **cơ chế JDK client**:

- xây dựng/mở kết nối;
- vòng đời callback của Listener;
- demand;
- fragmentation;
- hành vi send/close/error.

Nó không sở hữu:

- thiết kế WebSocket server;
- reconnect/backoff policy;
- chiến lược heartbeat của ứng dụng;
- STOMP hoặc messaging broker semantics;
- channel/topic/subscription model;
- luồng authentication ở protocol ứng dụng;
- distributed realtime architecture.

Mental handoff:

~~~text
JDK WebSocket API
→ làm thế nào Java client gửi/nhận

Realtime / Integration
→ message có ý nghĩa gì
→ reconnect/subscribe thế nào
→ topology và delivery semantics ra sao
~~~

Ranh giới này đặc biệt quan trọng khi dùng framework như Spring WebSocket: framework có thể che các chi tiết transport của JDK/client, nhưng các khái niệm protocol/ứng dụng vẫn không trở thành trách nhiệm của core Java Networking.

Chương cuối của module sẽ gom các lựa chọn TCP, UDP, NIO, HttpClient và WebSocket vào một mô hình quyết định chung để người học biết khi nào nên dùng abstraction nào và khi nào phải handoff sang Security, Concurrency hoặc Integration.
