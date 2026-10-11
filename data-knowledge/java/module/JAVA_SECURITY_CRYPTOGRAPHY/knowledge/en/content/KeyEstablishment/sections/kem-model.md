Java 21 includes the KEM API for Key Encapsulation Mechanisms.

~~~text
receiver owns public/private key pair

sender:
public key
  ↓ encapsulate
secret key + encapsulation message

receiver:
private key + encapsulation message
  ↓ decapsulate
same secret key
~~~

The encapsulation message can travel publicly; the receiver's private key enables recovery of the shared secret. Java 21 exposes the flow directly:

~~~java
KEM kem = KEM.getInstance("DHKEM");

KEM.Encapsulated encapsulated =
        kem.newEncapsulator(receiverPublicKey).encapsulate();

SecretKey senderSecret = encapsulated.key();
byte[] message = encapsulated.encapsulation();

SecretKey receiverSecret =
        kem.newDecapsulator(receiverPrivateKey).decapsulate(message);
~~~

The no-argument `encapsulate()` returns a `SecretKey` whose algorithm name is `Generic`; that secret is commonly used as input keying material for a KDF or protocol key schedule. KEM is useful for protocols designed around encapsulation rather than interactive agreement.

When `KEM.getInstance(...)` does not pin a provider, Java 21 may select providers later when creating the encapsulator and decapsulator based on the key and parameters. Creating the `KEM` object alone therefore does not necessarily pin one provider for every operation.
