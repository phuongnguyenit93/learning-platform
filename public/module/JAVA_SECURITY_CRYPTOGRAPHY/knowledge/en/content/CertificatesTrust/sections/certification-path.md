A leaf certificate is often trusted through a **certification path** that leads toward a trust anchor:

~~~text
leaf certificate
    ↓ signed by
intermediate CA
    ↓ issued toward
certificate issued by the trust anchor

trust anchor
    = separately configured trusted input
    ≠ a certificate contained in the CertPath
~~~

A peer usually supplies the leaf and necessary intermediate certificates. The trust anchor normally comes from local trust configuration and does not need to be transmitted by the peer.

Java models certificate/path data through `CertificateFactory` and `CertPath`; `CertPathBuilder` can build candidate paths from available material. By convention, an X.509 `CertPath` starts with the target certificate and ends with a certificate **issued by the trust anchor**; the certificate representing the trust anchor itself should not be included in the `CertPath`.

A chain merely existing does not mean it is valid. Validation still checks signatures, validity, constraints, intended usage, and the relationship to a trusted anchor.
