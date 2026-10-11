Many cryptographic operations depend on values that must be **unpredictable**: newly generated keys, salts, challenges, security tokens, and random nonces for designs that require random nonces.

java.util.Random may be appropriate for simulation or ordinary application behavior, but it does not provide the cryptographic contract. SecureRandom is designed as a cryptographically strong random-number generator.

~~~java
SecureRandom random = new SecureRandom();
byte[] bytes = new byte[32];
random.nextBytes(bytes);
~~~

The important property is not that the bytes “look random”; an attacker should not be able to predict useful future output from what has already been observed.

When a crypto engine accepts SecureRandom during initialization or generation, use an appropriate secure source rather than substituting a convenience PRNG.
