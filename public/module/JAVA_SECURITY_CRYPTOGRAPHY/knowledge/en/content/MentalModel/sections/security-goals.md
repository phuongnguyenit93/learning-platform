Cryptography matters when data must retain one or more **security guarantees** even while an attacker may be able to observe, modify, replay, or forge traffic or stored records.

The three goals used throughout this module are:

- **confidentiality** — unauthorized parties should not learn the protected content;
- **integrity** — unauthorized modification should be detectable;
- **authenticity** — the receiver should have evidence that data or credentials are tied to the expected key holder.

One mechanism does not automatically provide all three. Encryption can hide content while an unauthenticated mode may still allow undetected modification. A digest creates a fingerprint but, without a secret or trusted reference, does not prove who produced the data. MACs and digital signatures add authenticity through different key models.

The useful habit is to **name the security guarantee first, then choose the primitive and Java API**. Starting from an algorithm name usually reverses the reasoning process.
