`Cloneable`/`Object.clone()` có ngữ nghĩa khó dùng an toàn cho đồ thị đối tượng sâu cũng như thiết kế hàm khởi tạo/điều kiện hợp lệ. Thường ưu tiên:

- hàm khởi tạo sao chép;
- phương thức tạo đối tượng;
- sao chép/ánh xạ tường minh.

`finalize()` không phải công cụ quản lý tài nguyên đáng tin cậy. Tài nguyên nên dùng `AutoCloseable`/`try-with-resources` hoặc cơ chế dọn dẹp phù hợp khác.

Chương tiếp theo xem một dạng lớp đặc biệt: `enum` — một tập giá trị hữu hạn có kiểu rõ ràng nhưng mỗi hằng vẫn là một đối tượng thực sự.
