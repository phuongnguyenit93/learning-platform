Mật mã học biến một số giả định bảo mật thành các phép toán có thể kiểm tra bằng khóa, dữ liệu và thuật toán. Ví dụ, `Cipher` có thể biến plaintext thành ciphertext; `Mac` tạo giá trị xác thực bằng bí mật dùng chung (shared secret); `Signature` cho phép private key tạo chữ ký để public key xác minh.

Nhưng mật mã học **không thay thế toàn bộ kiến trúc bảo mật**. Nó không tự quyết định người dùng nào được phép gọi API, không tự bảo vệ máy đã bị chiếm quyền, không tự xoay vòng secret và không tự xác định certificate nào tổ chức của bạn phải tin.

~~~text
security requirement
    ↓
cryptographic goal
    ↓
primitive + key model
    ↓
Java security API
    ↓
vòng đời khóa và dữ liệu tin cậy + chính sách của ứng dụng
~~~

Module này tập trung vào phần từ mục tiêu mật mã đến Java security API và ngữ nghĩa bảo mật. Authentication/authorization framework, IAM, vận hành secret và PKI ở hạ tầng thuộc trách nhiệm của các module hoặc hệ thống tương ứng.
