Symmetric encryption uses the **same secret key** for encryption and decryption. It is well suited to bulk data because symmetric operations are generally efficient compared with public-key operations.

~~~text
plaintext + secret key
        ↓ encrypt
ciphertext

ciphertext + same secret key
        ↓ decrypt
plaintext
~~~

Security depends on more than the algorithm name. The key must be generated or derived correctly, distributed safely, rotated according to policy, and kept out of logs and accidental serialization.

“Symmetric” does not mean a protocol must use **one key for both traffic directions**. Many protocols derive separate client-to-server and server-to-client keys for key separation even though each directional key is still used by a symmetric primitive.

Symmetric encryption provides confidentiality. If the mode does not authenticate the ciphertext, the application still needs tamper detection. That is why this chapter establishes the Cipher model and the AEAD chapter adds authenticated protection.
