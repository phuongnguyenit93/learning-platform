**Additional Authenticated Data (AAD)** is data that does not need encryption but should be bound to the authentication tag, such as a protocol version, record identifier, or routing header.

~~~java
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(128, nonce));
cipher.updateAAD(headerBytes);
byte[] ciphertextAndTag = cipher.doFinal(plaintext);
~~~

The decrypting side must provide the same AAD bytes. With GCM/CCM, all AAD must be supplied through `updateAAD(...)` **before** ciphertext processing starts through `update(...)` or `doFinal(...)`. Modifying the authenticated header causes tag verification to fail even when the ciphertext itself is unchanged.

AAD is useful for preventing a valid ciphertext from being transplanted into a different context. As with signatures and MACs, the protocol must define the exact byte representation.
