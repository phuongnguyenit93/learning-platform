The Java Cryptography Architecture provides a common API layer for security services. Applications work with **engine classes** such as MessageDigest, Signature, SecureRandom, and KeyStore; the same provider architecture covers JCE engines such as Cipher, Mac, KeyAgreement, KeyGenerator, SecretKeyFactory, and KEM.

Application code normally requests a service by algorithm name:

~~~java
MessageDigest digest = MessageDigest.getInstance("SHA-256");
~~~

JCA then finds an implementation through the registered security Providers. This lets application code depend on a **service contract plus algorithm name** instead of directly constructing one vendor implementation.

That provider lookup is why provider architecture belongs in this module: it explains how an abstract cryptographic request becomes concrete runtime behavior.
