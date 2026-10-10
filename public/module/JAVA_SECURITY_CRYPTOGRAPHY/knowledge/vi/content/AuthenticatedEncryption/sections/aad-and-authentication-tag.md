**AAD (Additional Authenticated Data)** là dữ liệu không cần encrypt nhưng cần được ràng buộc vào authentication tag, ví dụ protocol version, record id hoặc header routing.

~~~java
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(128, nonce));
cipher.updateAAD(headerBytes);
byte[] ciphertextAndTag = cipher.doFinal(plaintext);
~~~

Bên decrypt phải cung cấp cùng AAD bytes. Với GCM/CCM, toàn bộ AAD phải được đưa vào bằng `updateAAD(...)` **trước** khi bắt đầu xử lý ciphertext bằng `update(...)` hoặc `doFinal(...)`. Nếu header bị đổi, tag verification thất bại dù ciphertext không đổi.

AAD rất hữu ích để tránh tình huống ciphertext hợp lệ bị chuyển sang context khác. Nhưng AAD contract cần canonical bytes/version rõ ràng giống signed-data contract.
