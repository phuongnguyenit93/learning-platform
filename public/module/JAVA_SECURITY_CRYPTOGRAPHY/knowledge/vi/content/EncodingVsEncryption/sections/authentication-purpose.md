MAC và digital signature cùng trả lời câu hỏi “dữ liệu này có bị sửa và có gắn với key holder dự kiến không?”, nhưng trust model khác nhau.

**MAC** dùng một secret key mà các bên cùng biết. Bất kỳ bên nào giữ secret đều có thể tạo MAC hợp lệ, nên MAC phù hợp cho trust domain chia sẻ secret.

**Digital signature** dùng private key để ký và public key để verify. Bên verify không cần biết private key; vì vậy mô hình này phù hợp khi nhiều verifier cần kiểm tra dữ liệu mà không được quyền ký.

Không cơ chế nào trong hai cơ chế trên mặc định che nội dung. Nếu thông điệp vừa cần bí mật vừa cần xác thực, hãy dùng một protocol/primitive kết hợp các bảo đảm đúng cách, chẳng hạn AEAD hoặc TLS, thay vì giả định signature hay MAC là encryption.
Từ đây, bước tiếp theo là hiểu Java biến các tên primitive/thuật toán đó thành implementation thực tế như thế nào qua JCA/JCE và Provider.
