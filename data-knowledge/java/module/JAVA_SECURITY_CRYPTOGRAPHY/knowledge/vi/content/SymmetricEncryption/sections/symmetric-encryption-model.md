Symmetric encryption dùng **cùng secret key cho phép toán encrypt/decrypt tương ứng**. Nó phù hợp với lượng dữ liệu lớn vì thường có chi phí thấp hơn asymmetric encryption.

~~~text
plaintext + secret key
        ↓ encrypt
ciphertext

ciphertext + same secret key
        ↓ decrypt
plaintext
~~~

Bảo mật của hệ thống không chỉ nằm ở algorithm. Secret key phải được sinh hoặc dẫn xuất đúng, phân phối an toàn, xoay vòng theo chính sách và không bị log/export ngoài ý muốn.

“Symmetric” không có nghĩa một protocol bắt buộc dùng **một key duy nhất cho cả hai hướng truyền**. Nhiều protocol derive key riêng cho client→server và server→client để tách phạm vi sử dụng key, dù mỗi key riêng lẻ vẫn là symmetric key.

Symmetric encryption giải quyết confidentiality. Nếu mode không có authentication, ứng dụng vẫn cần cơ chế phát hiện tampering. Vì vậy chapter này xây nền Cipher model; chapter AEAD sẽ chỉ ra cách confidentiality và integrity được gắn thành một contract.
