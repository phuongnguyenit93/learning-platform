Key role phải đi theo primitive, không theo trực giác “public/private cái nào cũng dùng được hai chiều”.

Với public-key encryption, public key thường dùng để encrypt cho bên sở hữu private key. Với signature, private key sign và public key verify. Với key agreement, mỗi bên có key pair và kết hợp private key của mình với public key của peer theo protocol.

Trong Java, public-key encryption vẫn đi qua `Cipher`; điểm khác chính là key role:

~~~java
Cipher encryptor = Cipher.getInstance(transformation);
encryptor.init(Cipher.ENCRYPT_MODE, receiverPublicKey);
byte[] ciphertext = encryptor.doFinal(plaintext);

Cipher decryptor = Cipher.getInstance(transformation);
decryptor.init(Cipher.DECRYPT_MODE, receiverPrivateKey);
byte[] recovered = decryptor.doFinal(ciphertext);
~~~

`transformation` phải đến từ protocol/scheme đã được xác định rõ. Không dùng chuỗi mơ hồ như `"RSA"` để né việc lựa chọn padding/encoding scheme.

Cùng interface PublicKey/PrivateKey không có nghĩa mọi key type hỗ trợ mọi engine. Một Ed25519 key dành cho signature không tự trở thành RSA encryption key.

Vì vậy code nên derive algorithm/protocol contract từ use case và metadata đáng tin cậy, không thử key trên engine rồi fallback ngẫu nhiên khi gặp InvalidKeyException.
