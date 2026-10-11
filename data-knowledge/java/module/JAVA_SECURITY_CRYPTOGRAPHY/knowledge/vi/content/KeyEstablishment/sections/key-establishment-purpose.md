Hai bên muốn dùng symmetric crypto nhưng chưa có shared secret gặp bài toán **thiết lập key material**. Gửi raw secret key qua kênh mà kẻ tấn công đọc được sẽ phá toàn bộ mục tiêu.

Key establishment dùng asymmetric/public information để hai bên đạt được secret material mà không truyền secret đó trực tiếp dưới dạng plaintext.

Có hai mental model trong Java 21:

- **KeyAgreement**: các bên đóng góp key material để tính cùng shared secret;
- **KEM**: sender encapsulate để tạo secret key + encapsulation message, receiver decapsulate bằng private key để lấy cùng secret key.

Sau bước này, protocol thường còn cần derivation/context binding trước khi có session keys cuối cùng.
