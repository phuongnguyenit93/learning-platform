A PRNG commonly expands a **seed** containing entropy into a longer output sequence. If the seed is predictable, the resulting output may become predictable even when the PRNG algorithm itself is sound.

Do not replace system entropy with timestamps, user identifiers, or fixed constants:

~~~java
// Not a production security pattern.
SecureRandom random = new SecureRandom();
random.setSeed(123456789L);
~~~

For a PRNG-based `SecureRandom`, the first output request normally forces self-seeding from the implementation's entropy source. There is an important exception: if `setSeed(...)` is called **before** `nextBytes(...)` or `reseed(...)`, that self-seeding step does not occur and the caller is responsible for providing seed material with enough entropy. Once seeded, later `setSeed(...)` calls supplement the existing seed rather than reducing randomness.

That is why application code should not “seed for safety” with timestamps, user identifiers, or constants. In ordinary application code, letting the JDK/provider handle seeding is safer than inventing predictable seed material.

If tests need reproducibility, build a test seam rather than making the production security path deterministic.
