A **generator creates new key material**, unlike a factory that reconstructs a key from existing material.

For symmetric keys, KeyGenerator is the main abstraction:

~~~java
KeyGenerator generator = KeyGenerator.getInstance("AES");
generator.init(256);
SecretKey key = generator.generateKey();
~~~

For asymmetric pairs, use KeyPairGenerator:

~~~java
KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
generator.initialize(2048);
KeyPair pair = generator.generateKeyPair();
~~~

The algorithms and sizes above demonstrate API shape, not a universal production recommendation. Real systems must follow current protocol and security policy.

Key generation ultimately depends on suitable randomness, which is why SecureRandom appears earlier in the learning path.
