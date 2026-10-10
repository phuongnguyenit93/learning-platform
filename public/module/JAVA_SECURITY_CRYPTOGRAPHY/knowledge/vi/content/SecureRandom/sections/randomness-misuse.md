Các lỗi thường gặp xoay quanh việc nhầm **random-looking** với **security-random**:

- dùng Random hoặc predictable seed cho reset token/key;
- reuse nonce trong mode yêu cầu uniqueness;
- dùng một salt cố định cho mọi password;
- tự tạo key bằng cách lấy substring/hash tùy ý từ dữ liệu dễ đoán;
- log raw random secret để debug.

Randomness cũng không sửa được một primitive dùng sai. Key ngẫu nhiên tốt không làm ECB trở thành authenticated encryption; nonce ngẫu nhiên không thay thế certificate validation.

Khi kiểm tra mã, hãy hỏi riêng hai câu: “giá trị này cần khó dự đoán hay chỉ cần duy nhất?” và “protocol yêu cầu ngẫu nhiên, duy nhất hay cả hai?”. Yêu cầu khác nhau dẫn đến cách sinh và vòng đời khác nhau.
Randomness an toàn thường được dùng để sinh key, nonce và seed; vì vậy bước kế tiếp là phân biệt các loại key và vòng đời của key material.
