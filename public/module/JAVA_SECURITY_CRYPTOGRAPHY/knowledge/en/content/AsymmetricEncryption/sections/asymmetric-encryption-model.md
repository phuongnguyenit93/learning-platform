Asymmetric encryption uses a public/private key pair to separate the party that can **protect data for a receiver** from the party that can **decrypt it**.

A common model is:

~~~text
plaintext + receiver public key
        ↓ encrypt
ciphertext

ciphertext + receiver private key
        ↓ decrypt
plaintext
~~~

The public key can be distributed; the private key must remain protected. But simply possessing a public key does not tell the sender whose key it is. Certificates and trust mechanisms provide that identity binding in many protocols.

Asymmetric encryption is not digital signature in reverse. Their goals, schemes, encodings, and failure properties are different.
