Key roles follow the primitive, not a generic rule that “public and private keys can just be used in opposite directions.”

For public-key encryption, the public key commonly encrypts for the private-key owner. For signatures, the private key signs and the public key verifies. In key agreement, each participant combines its own private key with peer public information according to the protocol.

In Java, public-key encryption still uses `Cipher`; the key role is what changes:

~~~java
Cipher encryptor = Cipher.getInstance(transformation);
encryptor.init(Cipher.ENCRYPT_MODE, receiverPublicKey);
byte[] ciphertext = encryptor.doFinal(plaintext);

Cipher decryptor = Cipher.getInstance(transformation);
decryptor.init(Cipher.DECRYPT_MODE, receiverPrivateKey);
byte[] recovered = decryptor.doFinal(ciphertext);
~~~

The `transformation` must come from a clearly specified protocol or scheme. Do not use an ambiguous string such as `"RSA"` merely to avoid choosing the required padding/encoding scheme.

The PublicKey and PrivateKey interfaces also do not mean every key family works with every engine. An Ed25519 signing key, for example, is not automatically an RSA encryption key.

Code should derive key usage from the protocol and trusted metadata, not try arbitrary engines and silently fall back after InvalidKeyException.
