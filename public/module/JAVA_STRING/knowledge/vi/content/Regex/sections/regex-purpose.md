Biểu thức chính quy (**Regex**) là một ngôn ngữ mô tả **mẫu văn bản**. Nó tồn tại để giải quyết những câu hỏi không còn là tìm một chuỗi cố định, ví dụ: “đầu vào có đúng cấu trúc mong muốn không?”, “hãy tìm mọi đoạn khớp một quy luật”, hoặc “hãy trích xuất các phần có hình dạng xác định”.

Regex hữu ích cho kiểm tra hợp lệ, tìm kiếm, trích xuất và thay thế khi bài toán thật sự mang tính **so khớp mẫu**. Nếu chỉ cần tìm một chuỗi cố định, kiểm tra tiền tố/hậu tố hoặc thay thế literal, API `String` trực tiếp thường đơn giản và dễ đọc hơn.

```text
tìm "users" đúng nguyên văn
→ contains / indexOf

tìm mọi chuỗi chữ số theo một quy luật
→ Regex

ngữ pháp dữ liệu phức tạp, có cấu trúc nhiều tầng
→ cân nhắc bộ phân tích cú pháp (parser) thay vì cố nhồi mọi thứ vào Regex
```
