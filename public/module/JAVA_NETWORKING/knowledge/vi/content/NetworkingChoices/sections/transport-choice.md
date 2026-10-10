Chọn transport/API nên bắt đầu từ semantic của dữ liệu.

**TCP / Socket**

- cần ordered byte stream;
- cần connection-oriented communication;
- ứng dụng tự định nghĩa framing/protocol;
- chấp nhận quản lý vòng đời kết nối trực tiếp.

**UDP / Datagram**

- mỗi datagram có ranh giới riêng;
- chấp nhận loss/reordering/duplication theo transport semantics;
- cần latency/control mà connection-oriented stream không phù hợp;
- ứng dụng chịu trách nhiệm nếu muốn reliability bổ sung.

**HttpClient**

- bài toán tự nhiên là HTTP request/response;
- muốn reusable client configuration, redirects, proxy, authentication, body handling, HTTP/1.1 hoặc HTTP/2;
- không muốn tự viết HTTP framing.

**WebSocket client**

- cần connection lâu sống và giao tiếp message-oriented hai chiều;
- server nói WebSocket;
- ứng dụng chấp nhận vòng đời event/listener.

Một cách nhớ:

~~~text
custom stream protocol      → TCP
independent datagrams       → UDP
giao tiếp tài nguyên HTTP   → HttpClient
bidirectional WS messaging  → WebSocket client
~~~

Nếu yêu cầu chỉ nói “real-time” hoặc “nhanh”, chưa đủ để chọn transport. Cần biết ngữ nghĩa giao nhận, trạng thái/vòng đời và protocol ứng dụng trước.
