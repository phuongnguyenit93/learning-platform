Anti-pattern phổ biến là bắt đầu bằng “dùng AES hay RSA?” trước khi biết cần bảo vệ điều gì.

Một luồng kiểm tra tốt hơn:

~~~text
tài sản cần bảo vệ + khả năng của kẻ tấn công
        ↓
mục tiêu bảo mật
        ↓
trust/key model
        ↓
standard protocol/primitive
        ↓
Java API + provider
        ↓
tham số + vòng đời + chính sách xử lý lỗi
~~~

Ví dụ nếu chỉ cần fingerprint để cache/deduplicate, encryption là sai abstraction. Nếu cần payload vừa bí mật vừa chống chỉnh sửa, digest + encryption rời rạc có thể kém rõ ràng hơn AEAD.

Lựa chọn API là kết quả của thiết kế, không phải điểm bắt đầu.
