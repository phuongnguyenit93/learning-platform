Với GCM, **nonce/IV uniqueness dưới cùng key là requirement cực kỳ quan trọng**. Reuse nonce có thể làm lộ quan hệ giữa plaintext và phá authentication security.

Nonce thường không cần bí mật. Điều cần bảo vệ là vòng đời:

- sinh theo strategy bảo đảm không reuse dưới cùng key;
- lưu/transmit nonce cùng ciphertext;
- khi key rotation xảy ra, quản lý namespace/counter/random strategy tương ứng.

Random nonce chỉ an toàn nếu xác suất collision phù hợp scale; counter nonce chỉ an toàn nếu state không rollback/reuse. Chọn strategy theo system architecture thay vì copy một snippet chung.

Không “sửa” nonce reuse bằng cách hash nonce cũ hoặc timestamp tùy ý.
