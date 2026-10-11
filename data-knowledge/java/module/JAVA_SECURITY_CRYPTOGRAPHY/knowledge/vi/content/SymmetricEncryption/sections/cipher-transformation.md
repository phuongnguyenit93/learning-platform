Java Cipher thường được tạo bằng transformation:

~~~text
algorithm / mode / padding
~~~

Ví dụ AES/GCM/NoPadding hoặc AES/CBC/PKCS5Padding. Ba phần quyết định hành vi khác nhau, nên chỉ viết "AES" có thể để provider default chọn phần còn lại theo cách không phù hợp chính sách bảo mật.

**Algorithm** xác định primitive lõi. **Mode** xác định cách block cipher xử lý nhiều block và tham số như IV/nonce. **Padding** xác định cách xử lý input không khớp block size khi mode cần padding.

Code review nên nhìn transformation như một security contract, không phải string cấu hình vô hại.

Trong design mới cần tamper detection, ưu tiên mode AEAD phù hợp thay vì dùng unauthenticated mode rồi tự nghĩ cách ghép integrity.
