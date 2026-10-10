Calling getInstance with only an algorithm name lets JCA search Providers in preference order. That is often the most portable choice:

~~~java
Signature signature = Signature.getInstance("SHA256withRSA");
~~~

Other overloads let code name a Provider or pass a Provider instance. Bind to a provider only when there is a concrete reason, such as a required PKCS#11/HSM integration or a service available only from that provider.

For `Cipher`, `KeyAgreement`, `Mac`, and `Signature`, the JDK also supports **delayed provider selection**. Calling `getInstance(...)` does not necessarily commit the engine to its final provider. The JDK can defer that choice until an initialization call receives the actual `Key`, allowing it to select a provider that can handle that key — an important capability for unextractable token/HSM keys.

~~~java
Signature signature = Signature.getInstance("SHA256withRSA");
signature.initSign(privateKey); // the actual provider may be selected here
Provider selected = signature.getProvider();
~~~

Once a provider has been selected for that engine instance, do not assume a later initialization will transparently switch providers. To reselect based on another key, obtain a new engine instance and initialize it with that key.

Unnecessary provider pinning makes deployment less flexible because provider names and service inventories can differ across JDKs and operating systems.

When an algorithm is required by the application contract, validate availability during bootstrap and fail explicitly rather than silently substituting a different primitive.
