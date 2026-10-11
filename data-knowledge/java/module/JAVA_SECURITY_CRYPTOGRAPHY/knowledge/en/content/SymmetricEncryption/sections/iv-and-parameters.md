Many modes require an **IV or nonce** in addition to the secret key. The value often does not need confidentiality, but it must satisfy the mode-specific property: some designs require unpredictability, others critically require uniqueness.

“Not secret” does not mean “any value is safe.” Reuse can destroy security.

Java represents parameters through types such as IvParameterSpec and GCMParameterSpec. The parameters needed for decryption are typically stored or transmitted with the ciphertext.

~~~text
stored/transmitted package
= algorithm/version metadata
+ IV/nonce
+ ciphertext
(+ authentication tag for authenticated modes)
~~~

The key is secret; IVs and nonces are usually public parameters whose lifecycle still has to follow the protocol.
