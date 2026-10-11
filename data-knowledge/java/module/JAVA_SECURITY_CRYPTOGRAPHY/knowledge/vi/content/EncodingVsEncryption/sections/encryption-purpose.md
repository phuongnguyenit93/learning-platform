Encryption giải quyết confidentiality bằng cách biến plaintext thành ciphertext dưới sự kiểm soát của key. Bên có key phù hợp có thể decrypt để khôi phục plaintext.

Điểm khác căn bản so với hashing là **encryption được thiết kế để đảo ngược có kiểm soát**. Hashing không có phép giải mã. Encoding thì đảo ngược được nhưng không cần secret.

~~~text
plaintext + key + parameters
        ↓ encrypt
ciphertext
        ↓ decrypt với key/parameters phù hợp
plaintext
~~~

Tuy nhiên confidentiality không tự kéo theo integrity. Nếu ứng dụng cần cả hai, authenticated encryption như GCM thường là mô hình phù hợp hơn việc tự ghép encryption và integrity primitives theo cảm tính.
