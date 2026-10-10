Với giá trị chỉ biết khi chạy, trình biên dịch/JVM có thể dùng các chiến lược khác nhau tùy phiên bản Java, ví dụ hạ xuống cơ chế giống `StringBuilder` hoặc dùng `invokedynamic` cho phép nối chuỗi.

Mã ứng dụng nên phụ thuộc vào **ngữ nghĩa của ngôn ngữ**, không phụ thuộc vào việc bytecode hiện tại dùng đúng lớp hỗ trợ nào.

Vì vậy không nên học quy tắc kiểu:

```text
mọi dấu + với String
→ trình biên dịch luôn tạo StringBuilder
```

Đó không phải hợp đồng của ngôn ngữ. Java hiện đại có thể dùng chiến lược nối khác, và chi tiết triển khai có quyền thay đổi.
