Các engine dùng **standard algorithm names** để mô tả service cần tìm. MessageDigest có thể dùng SHA-256; Mac có HmacSHA256; KeyStore có PKCS12.

Với Cipher, tên thường là một **transformation** gồm nhiều phần:

~~~text
algorithm / mode / padding
~~~

Ví dụ AES/GCM/NoPadding không chỉ nói “AES”. Nó còn khóa mode và padding semantics, từ đó kéo theo requirement về nonce/IV và authentication tag.

Không nên dựa vào chuỗi mơ hồ nếu **hành vi bảo mật** phụ thuộc mode/padding. Viết rõ transformation giúp quá trình review nhìn thấy hợp đồng mật mã và tránh phụ thuộc vào provider default không hiển nhiên.

Tên hợp lệ và mức bắt buộc hỗ trợ phải được kiểm tra theo Java Security Standard Algorithm Names và provider đang chạy, không suy từ ví dụ trên Internet.
