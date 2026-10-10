Use this table as an orientation map, not as a fixed algorithm prescription:

| Goal | Typical primitive | Main Java API |
| --- | --- | --- |
| fingerprint / compare with trusted reference | cryptographic hash | MessageDigest |
| integrity + shared-secret authenticity | MAC | Mac |
| authenticity with asymmetric keys | digital signature | Signature |
| confidentiality | encryption | Cipher |
| confidentiality + tamper detection | AEAD | Cipher with an AEAD mode |
| establish shared secret | key agreement / KEM | KeyAgreement / KEM |
| secure transport channel | TLS | JSSE |

Real systems often combine several rows. TLS, for example, uses certificate/trust handling to authenticate peers, a key-establishment mechanism to create session secrets, and symmetric authenticated protection for application traffic.

The module follows those dependencies deliberately:

~~~text
security goals + representation/primitive distinctions
        ↓
JCA/JCE + Providers
        ↓
SecureRandom + key material
        ↓
digest → MAC → digital signature
        ↓
symmetric/asymmetric encryption → AEAD
        ↓
key establishment → key derivation
        ↓
KeyStore → certification-path trust
        ↓
JSSE/TLS
        ↓
end-to-end design + failure review
~~~

Choose by security goal, trust model, protocol contract, and policy. “Strong algorithm” is not a substitute for a correct design.
