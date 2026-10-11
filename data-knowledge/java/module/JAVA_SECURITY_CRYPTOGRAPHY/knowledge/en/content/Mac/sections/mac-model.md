A Message Authentication Code adds a **secret key** to the integrity/authenticity problem. A receiver accepts a tag only when it can reproduce it from the same message and the expected shared secret.

~~~text
message + shared secret
       ↓ MAC
authentication tag
~~~

An attacker who modifies the message but does not know the secret should not be able to construct a valid replacement tag under the algorithm's security assumptions.

Unlike a plain digest, the trust comes from the shared secret. Unlike a digital signature, every holder of that secret can normally create valid MACs.
