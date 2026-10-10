Java dùng javax.crypto.Mac:

~~~java
Mac mac = Mac.getInstance("HmacSHA256");
mac.init(secretKey);
mac.update(headerBytes);
byte[] tag = mac.doFinal(payloadBytes);
~~~

Bên verify chạy cùng algorithm/key trên **đúng canonical bytes** rồi so tag. Với byte-array tag, có thể dùng `MessageDigest.isEqual(expectedTag, receivedTag)` thay vì tự viết vòng lặp dừng ngay khi gặp byte khác:

~~~java
byte[] expectedTag = verifier.doFinal(payloadBytes);
boolean valid = MessageDigest.isEqual(expectedTag, receivedTag);
~~~

`MessageDigest.isEqual(...)` kiểm tra toàn bộ bytes của digest đầu tiên; thời gian tính không phụ thuộc vào nội dung hai mảng. Nếu hai bên serialize JSON khác thứ tự field, normalize newline khác nhau hoặc dùng charset khác, MAC vẫn khác dù “nội dung logic” có vẻ giống.

Vì vậy protocol cần định nghĩa chính xác bytes nào được authenticate.

Không log shared key hoặc full secret material khi debug mismatch. Hãy log non-secret metadata như algorithm, message id, length và protocol version.
