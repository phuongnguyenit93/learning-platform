Có thể dùng bảng sau như bước định hướng đầu tiên, không phải danh sách thuật toán bắt buộc:

| Mục tiêu | Primitive điển hình | Java API chính |
| --- | --- | --- |
| fingerprint / phát hiện thay đổi so với giá trị tham chiếu đáng tin cậy | cryptographic hash | MessageDigest |
| integrity + authenticity với bí mật dùng chung | MAC | Mac |
| authenticity với asymmetric key | digital signature | Signature |
| confidentiality | encryption | Cipher |
| confidentiality + tamper detection | AEAD | Cipher với AEAD mode |
| thiết lập bí mật dùng chung | key agreement / KEM | KeyAgreement / KEM |
| secure channel | TLS | JSSE |

Một ứng dụng thực tế thường ghép nhiều dòng. Ví dụ TLS cần certificate/trust để xác thực peer, key establishment để tạo session key và symmetric authenticated encryption để bảo vệ lưu lượng.

Lộ trình học của module đi theo đúng quan hệ phụ thuộc đó:

~~~text
mục tiêu bảo mật + phân biệt cách biểu diễn/primitive
        ↓
JCA/JCE + Provider
        ↓
SecureRandom + key material
        ↓
digest → MAC → digital signature
        ↓
symmetric/asymmetric encryption → AEAD
        ↓
key establishment → key derivation
        ↓
KeyStore → certificate path/trust
        ↓
JSSE/TLS
        ↓
thiết kế end-to-end + review lỗi
~~~

Đừng chọn cơ chế chỉ vì nó “mạnh” hoặc quen thuộc. Hãy chọn theo mục tiêu bảo mật, mô hình khóa, hợp đồng protocol và chính sách của hệ thống.
