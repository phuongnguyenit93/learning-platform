Factories solve a different problem from generators: they **convert existing representations into Key objects or back into specifications**.

KeyFactory is commonly used with public/private keys. An encoded public key may be represented by X509EncodedKeySpec, while PKCS8EncodedKeySpec commonly represents encoded private-key material.

SecretKeyFactory is the analogous provider-based factory for supported secret-key representations, especially password-based material.

~~~text
brand-new key material
→ KeyGenerator / KeyPairGenerator

existing representation / KeySpec
→ KeyFactory / SecretKeyFactory
~~~

SecretKeySpec can wrap raw bytes as a provider-independent SecretKey for suitable algorithms, but it does not validate every algorithm-specific invariant. A specialized factory/specification may express the contract more precisely.
