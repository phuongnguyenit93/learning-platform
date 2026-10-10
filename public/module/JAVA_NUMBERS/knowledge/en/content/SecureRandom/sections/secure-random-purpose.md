Typical uses include:

- security tokens;
- nonces when a protocol requires a random nonce;
- salts;
- secret material;
- key-generation input when the surrounding API/protocol requires a random source.

```java
SecureRandom secureRandom = new SecureRandom();

byte[] bytes = new byte[32];
secureRandom.nextBytes(bytes);
```

### WHY not use SecureRandom for everything?

Cryptographic guarantees come with different initialization, provider, and performance characteristics from ordinary PRNGs.

For simulations or deterministic tests:

```text
reproducibility
→ often valuable

cryptographic unpredictability
→ not part of the requirement
```

An ordinary pseudo-random generator may therefore be the better tool.
