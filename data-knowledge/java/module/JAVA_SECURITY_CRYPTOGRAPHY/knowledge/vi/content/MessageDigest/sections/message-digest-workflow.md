Luồng xử lý của MessageDigest là nạp dữ liệu rồi kết thúc bằng digest():

~~~java
MessageDigest md = MessageDigest.getInstance("SHA-256");
md.update(headerBytes);
md.update(payloadBytes);
byte[] digest = md.digest();
~~~

Có thể gọi `digest(byte[])` cho dữ liệu đầu vào đơn giản hoặc `update(...)` nhiều lần khi dữ liệu đến theo stream/chunk.

Sau `digest()`, object trở về trạng thái ban đầu theo contract của `MessageDigest` và có thể dùng lại. Dù vậy, mã concurrent không nên chia sẻ một mutable digest instance giữa nhiều request nếu không có quyền sở hữu và synchronization rõ ràng.

Khi dữ liệu là text, luôn biến text thành bytes với charset explicit như StandardCharsets.UTF_8. “Cùng String” nhưng encoding khác có thể tạo digest khác.
