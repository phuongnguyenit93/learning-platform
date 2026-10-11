Derived key material should have a **defined purpose**. Reusing the same bytes across unrelated primitives or protocol contexts can couple security assumptions in unintended ways.

If a protocol needs multiple keys, follow its specified key-separation/derivation design instead of slicing or hashing bytes ad hoc.

Store the salt and KDF parameters with the protected record so future code can derive the same material. Do not store the password alongside the record in plaintext.

Password derivation also does not turn a weak password into a high-entropy secret. It increases the cost of guessing; password quality, rate limiting, MFA, and credential policy remain broader application concerns.
Generated or derived keys still need to be loaded, stored, and protected across their lifecycle; that is where KeyStore becomes relevant.
