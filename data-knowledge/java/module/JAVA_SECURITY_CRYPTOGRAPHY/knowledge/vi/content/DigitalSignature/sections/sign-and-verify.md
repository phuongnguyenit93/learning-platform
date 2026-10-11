Java dùng Signature engine với hai state chính: sign và verify.

~~~java
Signature signer = Signature.getInstance("SHA256withRSA");
signer.initSign(privateKey);
signer.update(message);
byte[] signature = signer.sign();

Signature verifier = Signature.getInstance("SHA256withRSA");
verifier.initVerify(publicKey);
verifier.update(message);
boolean valid = verifier.verify(signature);
~~~

Algorithm string mô tả signature scheme/digest composition theo provider contract. Môi trường thực tế không nên chọn algorithm chỉ vì ví dụ chạy được; phải theo protocol và chính sách bảo mật hiện hành.

Signature object có mutable state. Giống MessageDigest/Mac, tránh share instance không kiểm soát giữa concurrent requests.
