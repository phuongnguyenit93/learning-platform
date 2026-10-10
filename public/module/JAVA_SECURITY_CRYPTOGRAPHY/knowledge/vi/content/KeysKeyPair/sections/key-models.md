Cryptography dùng nhiều loại key vì các primitive có trust model khác nhau.

**Secret key** là dữ liệu bí mật được dùng ở cả hai phía của một symmetric primitive, ví dụ AES hoặc HMAC. Ai có key thường có khả năng thực hiện phép toán tương ứng.

**Public/private key pair** tách quyền: public key có thể phân phối rộng hơn, private key phải được bảo vệ. Tùy primitive, public key dùng để verify signature, encrypt/encapsulate hoặc tham gia key establishment; private key dùng cho phép toán đối ứng.

Trong Java, các type Key, SecretKey, PublicKey và PrivateKey biểu diễn role này. Type object không tự đảm bảo vòng đời an toàn; ứng dụng vẫn phải kiểm soát nơi key đến từ đâu, tồn tại bao lâu và ai có thể đọc/export key material.
