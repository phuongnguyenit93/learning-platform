# Khi nào nên dùng Annotation?

Sau khi đã hiểu Annotation là gì, cách định nghĩa Annotation, `@Retention`, `@Target`, Meta-Annotation, `@Repeatable`, `@Inherited` và xử lý Annotation tại thời điểm biên dịch, câu hỏi cuối cùng không còn là **“Annotation viết như thế nào?”** mà là:

> **Bài toán này có thực sự nên được biểu diễn bằng Annotation không?**

Annotation là một công cụ mô tả. Nó hữu ích khi thông tin cần nằm sát mã nguồn, tương đối ổn định và có một thành phần đọc rõ ràng. Nhưng nếu dùng Annotation để giấu quá nhiều cấu hình hoặc luồng xử lý, mã nguồn có thể khó hiểu hơn một API hay cấu hình tường minh.

Chương này tổng hợp toàn bộ module thành một mô hình thiết kế từ đầu đến cuối.
