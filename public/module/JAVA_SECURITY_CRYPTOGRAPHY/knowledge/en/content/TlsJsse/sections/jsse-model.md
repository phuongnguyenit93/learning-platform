JSSE (Java Secure Socket Extension) brings TLS security semantics into Java through APIs such as SSLContext, SSLSocket, SSLEngine, KeyManager, and TrustManager.

The focus here is **security composition**, not socket programming.

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

TLS combines capabilities learned earlier: certificate authentication, key establishment, negotiated algorithms, and symmetric authenticated traffic protection. That is why JSSE appears near the end of the module.
