Choosing the right type does not finish the design.

For example, this is not a complete requirement:

```text
"Money uses BigDecimal"
```

The domain may still need to define:

```text
input scale
intermediate precision
rounding mode
rounding point
equality/normalization rule
storage boundary
```

Likewise, choosing `long` does not answer whether overflow should wrap, throw, or be prevented by validation. Choosing `double` does not define the comparison tolerance. Choosing `SecureRandom` does not define a cryptographic protocol.

Think in two layers:

```text
representation
→ what values can be represented and with what arithmetic model?

policy
→ what behavior does this application require at risky boundaries?
```

Some concerns belong primarily to neighboring modules:

```text
equals / hashCode / ordering laws
→ Object Contract

hash-based / sorted collection behavior
→ Collection

localized number/currency presentation
→ Localization

keys / IVs / nonces / encryption / signatures
→ Security & Cryptography
```

Numbers should establish the numeric consequence and then hand off the deeper concern instead of duplicating another module.
