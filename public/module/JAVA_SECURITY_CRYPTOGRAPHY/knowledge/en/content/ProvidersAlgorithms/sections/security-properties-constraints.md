An API class being present does not mean every algorithm, protocol, or key size is allowed. JDK security properties and algorithm constraints can disable choices that are considered weak or incompatible with policy.

TLS and certification-path processing both apply such policy. Providers also expose only a particular set of services.

Treat policy-related failures as **security signals**, not invitations to downgrade automatically.

~~~text
API type exists
≠
provider implements service
≠
security policy permits use
~~~

Those three layers explain many NoSuchAlgorithmException, InvalidKeyException, certificate-validation, and handshake failures that the Java type system alone cannot reveal.
Once provider lookup is clear, the next dependency is the input material many cryptographic operations rely on: unpredictable randomness.
