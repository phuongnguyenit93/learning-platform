Two parties that want symmetric protection but do not yet share a secret need a **key-establishment mechanism**. Sending the raw symmetric key over an observable channel defeats the purpose.

Java 21 exposes two useful mental models:

- **KeyAgreement** — participants use key pairs/public information to compute a shared secret;
- **KEM** — a sender encapsulates to produce a secret key plus an encapsulation message, and a receiver decapsulates with a private key to recover the same secret.

The protocol may still need derivation and context binding before final session keys are used.

Key establishment solves secret creation/exchange mechanics; peer identity and trust must still be established separately.
