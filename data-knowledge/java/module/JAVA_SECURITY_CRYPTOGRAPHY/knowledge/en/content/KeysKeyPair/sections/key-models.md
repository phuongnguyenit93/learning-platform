Cryptographic primitives use different key models because they express different trust relationships.

A **secret key** is confidential material used by symmetric primitives such as AES or HMAC. A party that has the secret usually has the authority to perform the corresponding operation.

A **public/private key pair** separates capabilities. The public key can be distributed more broadly, while the private key must remain protected. Depending on the primitive, the public key may verify signatures, encrypt or encapsulate, or participate in key establishment; the private key performs the complementary operation.

Java represents these roles through Key, SecretKey, PublicKey, and PrivateKey. The type does not manage lifecycle by itself: the application still needs to know where the key came from, how long it should exist, and whether it can be exported.
