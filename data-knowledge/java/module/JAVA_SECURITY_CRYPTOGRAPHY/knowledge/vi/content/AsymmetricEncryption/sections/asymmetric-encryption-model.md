Asymmetric encryption dùng public/private key pair để tách người có thể **bảo vệ dữ liệu cho receiver** khỏi người có thể **giải mã**.

Trong mô hình phổ biến:

~~~text
plaintext + receiver public key
        ↓ encrypt
ciphertext

ciphertext + receiver private key
        ↓ decrypt
plaintext
~~~

Public key có thể được phân phối; private key phải được bảo vệ. Nhưng việc có một public key chưa đủ: sender còn phải biết public key đó thực sự thuộc receiver nào. Certificate/trust là lớp giúp gắn key với identity trong nhiều protocol.

Asymmetric encryption không phải digital signature đảo chiều; mục tiêu, padding/scheme và security proof khác nhau.
