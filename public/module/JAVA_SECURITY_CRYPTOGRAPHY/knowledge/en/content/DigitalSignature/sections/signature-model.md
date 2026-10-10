A digital signature uses an asymmetric key pair to separate **signing authority** from **verification authority**.

~~~text
message + private key
       ↓ sign
signature

message + signature + public key
       ↓ verify
true / false
~~~

The private key must remain protected; the public key can be distributed to verifiers. Verification is meaningful only if the verifier has a trustworthy binding between that public key and the expected signer identity.

That is why certificates and trust appear later: correct signature mathematics does not help if the application trusts the wrong public key.
