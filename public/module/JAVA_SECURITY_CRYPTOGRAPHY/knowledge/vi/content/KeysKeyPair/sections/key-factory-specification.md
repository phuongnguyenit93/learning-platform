Factory giải quyết bài toán khác generator: **chuyển existing material thành Key object hoặc ngược lại**.

KeyFactory thường dùng cho public/private key. Ví dụ public key encoded theo X.509 SubjectPublicKeyInfo có thể được dựng từ X509EncodedKeySpec; private key encoded theo PKCS#8 thường dùng PKCS8EncodedKeySpec.

`SecretKeyFactory` thực hiện vai trò factory cho các cách biểu diễn secret key mà thuật toán hỗ trợ, đặc biệt với password-based key material.

~~~text
brand-new key material
→ KeyGenerator / KeyPairGenerator

cách biểu diễn sẵn có / KeySpec
→ KeyFactory / SecretKeyFactory
~~~

SecretKeySpec là shortcut provider-independent cho raw secret bytes của các algorithm phù hợp, nhưng constructor của nó không xác minh mọi invariant algorithm-specific. Khi algorithm có key parameters hoặc validation riêng, factory/spec chuyên biệt thường biểu diễn contract rõ hơn.
