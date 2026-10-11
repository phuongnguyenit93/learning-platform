Có thể phân biệt ba cơ chế bằng câu hỏi “ai có thể tạo giá trị hợp lệ?”:

| Cơ chế | Key khi tạo | Ai có thể tạo |
| --- | --- | --- |
| digest | không key | bất kỳ ai có data |
| MAC | shared secret | mọi holder của secret |
| signature | private key | holder của private key |

MAC cung cấp integrity + shared-secret authenticity, nhưng không cung cấp confidentiality. Message vẫn đọc được nếu không có encryption.

Trong protocol mới cần cả confidentiality và integrity, authenticated encryption thường đơn giản và ít lỗi composition hơn việc tự encrypt rồi tự thêm MAC, trừ khi protocol specification đã định nghĩa composition cụ thể.
MAC giải quyết authenticity trong trust domain chia sẻ secret; khi verifier không được có quyền tạo giá trị hợp lệ, mô hình tiếp theo cần tách signing authority bằng digital signature.
