Networking cần biết **TLS nằm ở đâu trong stack**, nhưng không sở hữu toàn bộ security curriculum.

Mental model:

~~~text
application protocol
        ↓
TLS secure transport
        ↓
TCP/network transport
~~~

Trong JDK, JSSE cung cấp các abstraction như SSLContext, SSLSocket, SSLServerSocket và SSLEngine. HttpClient/WebSocket qua HTTPS/WSS có thể sử dụng TLS phía dưới mà ứng dụng không trực tiếp thao tác từng TLS record.

Networking cần hiểu các hệ quả vận hành:

- handshake có thể thất bại trước khi dữ liệu ứng dụng được trao đổi;
- endpoint identity/certificate validation ảnh hưởng việc connect thành công;
- TLS có vòng đời và cấu hình riêng.

Nhưng các topic sau thuộc **Security & Cryptography**:

- trust store / key store;
- certificate chain và X.509;
- cipher suite và protocol security;
- key material;
- custom TrustManager/KeyManager;
- cryptographic correctness.

Vì vậy khi gặp SSLHandshakeException, Networking giúp xác định lỗi xảy ra ở bước thiết lập security sau transport connection; nguyên nhân certificate/trust cụ thể cần handoff sang module Security.
