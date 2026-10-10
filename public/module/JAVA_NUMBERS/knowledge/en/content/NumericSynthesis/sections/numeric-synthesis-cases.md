### Counter with a known upper bound

Requirement:

```text
whole number
maximum below 2 billion
overflow would indicate a bug
```

Reasoning:

```text
int
→ range is sufficient
→ arithmetic is exact inside that range
→ validate the bound or use checked arithmetic where overflow is unacceptable
```

### Scientific measurement

Requirement:

```text
fractional values
large dynamic range
small representation error is acceptable
```

Reasoning:

```text
double
→ binary approximation is acceptable
→ comparison uses a domain-defined error strategy
→ NaN / infinity must be handled if inputs or operations can produce them
```

### Monetary calculation

Requirement:

```text
decimal meaning must be preserved
rounding rules are part of the business contract
```

Reasoning:

```text
BigDecimal
→ construct from decimal intent, not an already-rounded binary value
→ define scale / precision / rounding boundaries
→ decide whether equality uses representation or numerical quantity
```

### Integer beyond long

Requirement:

```text
whole number
valid values may exceed long
```

Reasoning:

```text
BigInteger
→ no fixed-width overflow for valid values
→ arithmetic uses methods and returns new objects
→ primitive conversion becomes an explicit narrowing boundary
```

### Security-sensitive random value

Requirement:

```text
an attacker must not be able to predict future output
```

Reasoning:

```text
SecureRandom
→ unpredictability is part of the requirement
→ allow the platform/provider to manage seeding in ordinary application code
→ hand cryptographic protocol design to Security & Cryptography
```

The final checklist for numeric code is therefore:

```text
1. What does the value mean?
2. What range is valid?
3. Must representation be exact, decimal-exact, or only approximate?
4. What failure mode is acceptable?
5. What comparison rule is correct?
6. Where may rounding happen?
7. Does conversion cross a lossy boundary?
8. Is randomness only statistical/reproducible, or security-sensitive?
9. Does the next concern belong to another Java module?
```

If these questions can be answered explicitly, numeric behavior is being designed rather than guessed.
