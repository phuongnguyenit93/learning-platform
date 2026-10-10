JSSE (Java Secure Socket Extension) đưa TLS vào Java thông qua các API như SSLContext, SSLSocket, SSLEngine, KeyManager và TrustManager.

Trong module này, trọng tâm là **ngữ nghĩa bảo mật**, không phải lập trình socket.

~~~text
local key/certificate material
        ↓ KeyManager
SSLContext
        ↑ TrustManager
trusted CA / peer trust material
        ↓
TLS handshake
        ↓
authenticated secure session
~~~

TLS kết hợp nhiều primitive: đàm phán tham số, certificate authentication, key establishment và bảo vệ record bằng cơ chế symmetric. Vì vậy JSSE xuất hiện cuối module sau khi người học đã hiểu từng khối nền tảng.
