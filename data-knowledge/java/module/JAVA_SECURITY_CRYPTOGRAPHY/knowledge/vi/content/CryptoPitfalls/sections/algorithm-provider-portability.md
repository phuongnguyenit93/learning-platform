Algorithm/provider selection cần cân bằng chính sách bảo mật và portability.

Nên:

- dùng standard algorithm names khi có thể;
- tránh hard-code provider nếu không có requirement;
- validate required algorithms lúc bootstrap;
- version protocol/data format để future migration có chỗ biểu diễn algorithm/parameter change;
- để JDK constraints chặn lựa chọn yếu thay vì silently downgrade.

Không nên lưu ciphertext mà không lưu đủ metadata để biết transformation/version/nonce/KDF parameters cần thiết cho decrypt sau này.

“Works on my JDK” chưa chứng minh portability. Tập Provider và chính sách có thể khác giữa OS, JDK vendor, triển khai HSM và future JDK.
