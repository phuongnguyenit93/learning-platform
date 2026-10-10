# Vòng đời của Annotation với @Retention

`@Retention` trả lời một câu hỏi về **vòng đời của siêu dữ liệu**:

> Annotation cần tồn tại đến lúc xử lý mã nguồn, class file hay thời gian chạy?

Java có ba `RetentionPolicy`: `SOURCE`, `CLASS`, `RUNTIME`. Chọn chính sách lưu giữ không nên dựa trên suy nghĩ “RUNTIME mạnh hơn”, mà dựa trên **thành phần nào thực sự cần đọc Annotation và ở giai đoạn nào**.

Nếu kiểu Annotation không khai báo `@Retention`, chính sách mặc định là **`CLASS`**.

Chương này chỉ tập trung vào **vòng đời**. Để tránh trộn hai câu hỏi quá sớm, các ví dụ dưới đây chưa thêm `@Target`; chương kế tiếp sẽ quyết định Annotation được phép đặt ở đâu.
