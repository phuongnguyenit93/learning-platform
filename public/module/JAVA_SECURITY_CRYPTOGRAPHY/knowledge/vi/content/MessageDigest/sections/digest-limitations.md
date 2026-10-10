Ba nhầm lẫn phổ biến:

1. **digest = encryption** — sai vì hash không có decrypt;
2. **digest = authentication** — sai nếu reference không được bảo vệ;
3. **hash password bằng SHA-256 một lần là đủ** — sai vì password có entropy thấp và kẻ tấn công có thể thử các giá trị đoán rất nhanh.

Nếu cần authenticity với shared secret, chuyển sang MAC. Nếu cần public verification, dùng digital signature. Nếu cần password-derived key, dùng password-based derivation với salt/work factor phù hợp.

MessageDigest vẫn là primitive nền tảng quan trọng; vấn đề không nằm ở API mà ở việc gán cho nó security guarantee nó không có.
Giới hạn lớn nhất của digest là không có secret để xác thực bên tạo dữ liệu; đó chính là động lực chuyển sang MAC.
