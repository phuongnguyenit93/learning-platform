Many failures happen in **material lifecycle**, not inside the primitive:

- secrets hard-coded in source;
- keys leaked through logs or serialization;
- passwords kept in immutable strings longer than necessary;
- AEAD nonces reused under the same key;
- one fixed salt used for every credential;
- one key reused across purposes without a protocol design that permits it.

Classify data explicitly:

~~~text
secret: private key, symmetric key, password
non-secret but security-relevant: certificate, salt, IV/nonce
public protocol metadata: algorithm/version identifiers
~~~

“Public” does not mean “unimportant.” A nonce or salt can be public while still having strict uniqueness/randomness requirements.
