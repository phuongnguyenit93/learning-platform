Authenticated Encryption with Associated Data (AEAD) combines **confidentiality with integrity/authenticity of the protected record and its chosen context**.

Instead of decrypting ciphertext and merely hoping it was not modified, an AEAD construction produces an authentication tag. Decryption is successful only if verification succeeds.

~~~text
plaintext + key + nonce + optional AAD
        ↓ AEAD encrypt
ciphertext + tag
~~~

Java Cipher supports AEAD modes such as GCM through an appropriate transformation.

AEAD does not solve key ownership or identity by itself. A party that already has a valid key can generate valid ciphertext and tags, so key management and trust remain separate responsibilities.
