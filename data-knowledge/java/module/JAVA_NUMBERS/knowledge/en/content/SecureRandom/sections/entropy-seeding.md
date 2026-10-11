Mental model:

```text
entropy source
    ↓
hard-to-predict seed / state
    ↓
cryptographic PRNG
    ↓
hard-to-predict output
```

### Default application rule

For ordinary application code:

```java
SecureRandom secureRandom = new SecureRandom();
```

and allowing the platform/provider to manage seeding is usually safer than inventing a seed manually.

### Pitfall: weak manual seeding

```java
SecureRandom secureRandom = new SecureRandom();
secureRandom.setSeed(System.currentTimeMillis()); // do not rely on a timestamp as primary entropy
```

An important detail is that `setSeed` **supplements** existing seed/state, so repeated calls do not by themselves reduce the randomness of an instance that was already seeded well. However, for a newly created PRNG `SecureRandom`, calling `setSeed` **before the first `nextBytes`/`reseed` call** prevents automatic self-seeding; the caller must then ensure that the supplied seed has enough entropy.

Therefore a timestamp or output from ordinary `Random` should not be treated as the primary entropy source for a security-sensitive generator.

Do not reason:

```text
SecureRandom class
→ every manually chosen seed is automatically secure
```

The security property depends on the complete entropy/state lifecycle.

### `getInstanceStrong` is not a universal default

`SecureRandom.getInstanceStrong()` may choose a provider/algorithm with stronger platform-specific characteristics, but it may also have different latency, blocking, or availability behavior.

```text
default SecureRandom
→ usually appropriate for application use cases

getInstanceStrong()
→ use when a concrete requirement needs that contract
```
