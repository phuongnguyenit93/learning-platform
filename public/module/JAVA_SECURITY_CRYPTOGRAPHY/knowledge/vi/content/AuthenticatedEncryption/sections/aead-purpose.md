Authenticated Encryption with Associated Data (AEAD) giải quyết cùng lúc **confidentiality + integrity/authenticity của ciphertext context**.

Thay vì “encrypt rồi hy vọng dữ liệu không bị sửa”, AEAD tạo authentication tag. Decrypt chỉ được coi là thành công khi tag verify.

~~~text
plaintext + key + nonce + optional AAD
        ↓ AEAD encrypt
ciphertext + tag
~~~

Java Cipher hỗ trợ AEAD modes như GCM qua transformation phù hợp. Với design mới, đây thường là mental model tốt hơn unauthenticated encryption khi payload vừa cần bí mật vừa cần tamper detection.

AEAD không thay thế identity/key management: nếu kẻ tấn công có key hợp lệ, họ vẫn có thể tạo ciphertext/tag hợp lệ.
