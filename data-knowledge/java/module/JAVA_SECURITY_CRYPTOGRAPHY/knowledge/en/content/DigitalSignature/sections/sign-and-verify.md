Java uses the Signature engine in signing or verification state:

~~~java
Signature signer = Signature.getInstance("SHA256withRSA");
signer.initSign(privateKey);
signer.update(message);
byte[] signature = signer.sign();

Signature verifier = Signature.getInstance("SHA256withRSA");
verifier.initVerify(publicKey);
verifier.update(message);
boolean valid = verifier.verify(signature);
~~~

The algorithm name describes a signature scheme according to the provider contract. Production choices must follow protocol and current security policy, not merely an example that happens to run.

Signature is stateful. Avoid uncontrolled sharing of one instance across concurrent requests.
