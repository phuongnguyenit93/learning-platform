Three recurring mistakes are:

1. **digest = encryption** — false because a hash has no decrypt operation;
2. **digest = authentication** — false unless the reference itself is trusted;
3. **one fast hash = password protection** — insufficient because human passwords are low-entropy and candidates can be tested cheaply.

Use a MAC when shared-secret authenticity is required. Use a digital signature when public verification is required. Use password-based derivation for password-derived key material.

MessageDigest remains a foundational primitive; the problem is assigning it guarantees that it does not provide.
The central limitation of a digest is the absence of a secret that authenticates the producer; that limitation motivates the move to MACs.
