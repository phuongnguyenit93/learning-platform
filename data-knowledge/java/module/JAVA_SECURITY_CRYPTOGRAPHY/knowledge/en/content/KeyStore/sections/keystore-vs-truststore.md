**Keystore** and **truststore** are usually names for **roles**, not distinct Java types or mandatory file formats.

- a local identity store commonly holds a PrivateKeyEntry plus certificate chain;
- a trust store commonly holds TrustedCertificateEntry values representing trusted issuers or anchors.

Both can be PKCS12 KeyStore instances. In JSSE, a KeyManager consumes local credentials while a TrustManager consumes trust material.

Separate stores often make operations and least privilege clearer, but that is a deployment design choice. Do not infer a store's role only from its filename extension; inspect entry types and configuration.
KeyStore explains where key and certificate material is held and under which entry roles; deciding whether a public key or certificate is trusted requires certification-path validation next.
