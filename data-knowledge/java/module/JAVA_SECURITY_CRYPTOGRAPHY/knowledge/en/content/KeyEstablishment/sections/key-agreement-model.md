KeyAgreement represents mechanisms such as Diffie-Hellman or ECDH.

Conceptually:

~~~text
Alice private + Bob public
        ↓
shared secret

Bob private + Alice public
        ↓
same shared secret
~~~

The Java flow obtains an engine, initializes it with the local private key, processes peer public information with `doPhase`, and calls `generateSecret`:

~~~java
KeyAgreement agreement = KeyAgreement.getInstance("ECDH");
agreement.init(alicePrivateKey);
agreement.doPhase(bobPublicKey, true);
byte[] sharedSecret = agreement.generateSecret();
~~~

The raw shared secret is commonly input keying material for a protocol KDF or key schedule. Do not assume those bytes should be used directly as an application key unless the protocol explicitly defines that use.

Public-key exchange does **not** authenticate the peer by itself. If an attacker can replace the exchanged public keys and the protocol has no authenticated binding, the participants may establish secrets with the attacker.

Protocols such as TLS compose key agreement with certificate/signature-based authentication precisely to close that gap.
