`Random` and `ThreadLocalRandom` are not designed to resist an attacker predicting state or future output.

Do not use them for:

- password-reset tokens;
- session secrets;
- authentication tokens;
- cryptographic nonces;
- key material;
- security-sensitive identifiers where unpredictability is required.

### A seed is not a password

```java
new Random(System.currentTimeMillis())
```

does not make the generator secure. A timestamp has very different predictability and search space from strong entropy.

If an attacker must not be able to predict the next output, move to `SecureRandom`.
