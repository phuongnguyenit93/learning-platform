# Phạm vi áp dụng và vị trí sử dụng Annotation

`@Retention` trả lời **siêu dữ liệu sống bao lâu**. `@Target` trả lời một câu hỏi độc lập:

> Annotation được phép xuất hiện ở những ngữ cảnh nào?

Giới hạn bằng `@Target` không chỉ giúp mã nguồn rõ ràng hơn. Nó biến một phần **quy tắc ngữ nghĩa** thành điều trình biên dịch có thể kiểm tra.

Nếu `@Audit` chỉ có nghĩa trên method, việc cho phép đặt nó lên field hoặc package sẽ tạo siêu dữ liệu vô nghĩa.
