KeyAgreement engine biểu diễn family như Diffie-Hellman/ECDH.

Flow khái niệm:

~~~text
Alice private + Bob public
        ↓
shared secret

Bob private + Alice public
        ↓
same shared secret
~~~

Java API thường có `getInstance`, `init(privateKey)`, `doPhase(peerPublicKey, true)`, rồi `generateSecret()`:

~~~java
KeyAgreement agreement = KeyAgreement.getInstance("ECDH");
agreement.init(alicePrivateKey);
agreement.doPhase(bobPublicKey, true);
byte[] sharedSecret = agreement.generateSecret();
~~~

Raw shared secret thường chỉ là vật liệu đầu vào cho bước derivation/key schedule của protocol; không nên mặc định lấy bytes đó dùng trực tiếp làm key của ứng dụng nếu specification chưa định nghĩa như vậy.

Public key exchange **không tự xác thực peer**. Nếu kẻ tấn công thay public key ở giữa và protocol không có certificate, signature hoặc authenticated channel, hai phía có thể thiết lập bí mật với kẻ tấn công thay vì với nhau.

Vì vậy key agreement và peer authentication là hai vấn đề riêng nhưng phải được kết hợp đúng trong protocol như TLS.
