Networking needs to know **where TLS sits in the stack**, but it does not own the complete security curriculum.

Mental model:

~~~text
application protocol
        ↓
TLS secure transport
        ↓
TCP/network transport
~~~

JSSE provides JDK abstractions such as SSLContext, SSLSocket, SSLServerSocket, and SSLEngine. HttpClient/WebSocket over HTTPS/WSS can use TLS underneath without application code manipulating TLS records directly.

Networking needs the operational consequences:

- handshake can fail before application data is exchanged;
- endpoint identity/certificate validation can prevent a connection from succeeding;
- TLS has its own configuration and lifetime.

The following belong to **Security & Cryptography**:

- trust stores and key stores;
- certificate chains and X.509;
- cipher suites and protocol security;
- key material;
- custom TrustManager/KeyManager behavior;
- cryptographic correctness.

When SSLHandshakeException occurs, Networking helps locate the failure at the security setup stage after/beside transport establishment; the certificate/trust cause belongs to the Security module.
