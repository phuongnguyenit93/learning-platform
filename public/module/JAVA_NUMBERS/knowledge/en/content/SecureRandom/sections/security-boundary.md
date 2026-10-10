The Numbers module only needs this distinction:

```text
Random
→ deterministic pseudo-random contract
→ tests / simulations / general randomness

SecureRandom
→ attacker-oriented unpredictability contract
→ security-sensitive randomness
```

Deeper topics such as key-size selection, cipher modes, nonce uniqueness, IV construction, provider configuration, entropy-source internals, and cryptographic protocol design belong in the security/cryptography module.

Using `SecureRandom` alone is not enough to design cryptography safely. It solves the **random-source** part of a larger protocol contract.

The next chapter combines the entire module into one decision process: choose the representation first, then make overflow, comparison, rounding, and randomness policies explicit where the domain requires them.
