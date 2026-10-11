Key object là điểm Java code chạm vào **vật liệu bí mật có giá trị cao**. Vì vậy vòng đời quan trọng ngang với thuật toán.

Các câu hỏi cần có khi review thiết kế:

- key được generate, derive hay load từ KeyStore/HSM?
- key có export được raw bytes hay provider giữ non-exportable?
- key tồn tại trong memory bao lâu?
- log, exception hoặc serialization có vô tình làm lộ key không?
- rotation/revocation do ứng dụng hay infrastructure sở hữu?

Java type có thể hỗ trợ Destroyable ở một số phần triển khai, nhưng không nên giả định gọi destroy là xóa mọi bản sao key khỏi toàn bộ heap/provider/native memory.

Module này dạy API boundary. Chính sách cấp phát, rotation, backup, escrow và hardware protection thuộc secret/PKI infrastructure.
Khi mô hình key đã rõ, có thể bắt đầu nhóm primitive integrity/authenticity từ trường hợp đơn giản nhất: digest không dùng key.
