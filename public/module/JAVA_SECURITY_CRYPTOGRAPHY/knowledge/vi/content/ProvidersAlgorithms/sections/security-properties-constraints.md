Việc API tồn tại không có nghĩa mọi algorithm/key size/protocol đều được phép. JDK có security properties và algorithm constraints có thể vô hiệu hóa hoặc hạn chế các lựa chọn đã yếu hoặc không phù hợp chính sách.

Ví dụ các chính sách liên quan TLS và certificate path có thể chặn thuật toán/key size ngay trong handshake hoặc validation. Provider cũng có thể chỉ hỗ trợ một tập algorithm nhất định.

Ứng dụng nên coi lỗi do chính sách là một **security signal**, không phải lý do để tự động hạ cấp xuống thuật toán yếu hơn.

Thực tế vận hành cần phân biệt:

~~~text
API có class
≠
provider có phần triển khai
≠
chính sách cho phép sử dụng
~~~

Ba lớp này giải thích nhiều lỗi kiểu `NoSuchAlgorithmException`, `InvalidKeyException` hoặc lỗi handshake/validation mà chỉ đọc Java type system không thấy được.
Sau khi biết Java tìm implementation mật mã ra sao, cần đi xuống vật liệu đầu vào đầu tiên của nhiều phép toán: nguồn ngẫu nhiên khó dự đoán.
