**Encoding** đổi cách biểu diễn dữ liệu để phù hợp với format hoặc transport, không tạo ranh giới bí mật. Base64 là ví dụ quen thuộc: binary bytes được biểu diễn thành text an toàn cho nhiều kênh truyền, nhưng bất kỳ ai cũng có thể decode.

~~~java
String encoded = Base64.getEncoder()
        .encodeToString("hello".getBytes(StandardCharsets.UTF_8));

byte[] original = Base64.getDecoder().decode(encoded);
~~~

Nếu một token chỉ được Base64-encode, token vẫn là secret ở dạng có thể đảo ngược mà không cần key. Vì vậy “không đọc được bằng mắt” không đồng nghĩa với encryption.

Encoding vẫn quan trọng trong hệ thống mật mã vì ciphertext, digest, signature hoặc certificate thường cần được biểu diễn dưới dạng text. Nó là **lớp biểu diễn**, không phải primitive bảo mật.
