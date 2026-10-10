The general Cipher workflow is:

~~~java
Cipher cipher = Cipher.getInstance(transformation);
cipher.init(Cipher.ENCRYPT_MODE, key, parameters);
byte[] ciphertext = cipher.doFinal(plaintext);

Cipher decryptor = Cipher.getInstance(transformation);
decryptor.init(Cipher.DECRYPT_MODE, key, parameters);
byte[] recovered = decryptor.doFinal(ciphertext);
~~~

This is an API-shape example, not a production recipe without an agreed transformation and parameter strategy.

Cipher is stateful and initialized for a particular operation. Do not treat one instance as an immutable service that can be shared freely among threads.

Most importantly, successful decryption does not always prove that ciphertext was authentic. An unauthenticated mode can produce plaintext after attacker-controlled modification. AEAD adds an authentication check to that boundary.
Symmetric encryption is efficient for payloads but introduces the problem of distributing and protecting a shared key; asymmetric encryption supplies another key model for suitable flows.
