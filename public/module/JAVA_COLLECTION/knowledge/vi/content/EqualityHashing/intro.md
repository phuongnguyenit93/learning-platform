# Tính bằng nhau, hash và tính đúng đắn khi tra cứu

Collection dựa vào quy ước của phần tử để trả lời các câu hỏi rất thực tế: “phần tử này đã tồn tại chưa?”, “khóa này nằm ở đâu?”, “hai giá trị có phải cùng một phần tử logic không?”. Vì vậy một lỗi trong tính bằng nhau, hash hoặc phép so sánh có thể làm collection trông như “mất dữ liệu” dù đối tượng vẫn đang nằm bên trong cấu trúc.

Chương này tập trung vào **hệ quả của tính bằng nhau, hash và phép so sánh đối với collection**. Cách thiết kế đúng `equals` và `hashCode` thuộc module **Quy ước của Object** (`object-contract`).
