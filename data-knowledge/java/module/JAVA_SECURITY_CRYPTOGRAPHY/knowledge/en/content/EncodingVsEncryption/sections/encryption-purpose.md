Encryption provides confidentiality by transforming plaintext into ciphertext under the control of a key. A party with the appropriate key and parameters can reverse the transformation.

~~~text
plaintext + key + parameters
        ↓ encrypt
ciphertext
        ↓ decrypt
plaintext
~~~

This reversibility under key control is the key distinction from hashing. Hashing has no decrypt operation. Encoding is reversible too, but requires no secret.

Confidentiality does not automatically imply integrity. If both are required, an authenticated-encryption construction such as GCM is usually a better starting point than inventing an ad hoc combination of encryption and integrity checks.
