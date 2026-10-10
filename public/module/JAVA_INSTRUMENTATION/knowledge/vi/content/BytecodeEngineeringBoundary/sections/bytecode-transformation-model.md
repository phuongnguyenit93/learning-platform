Trong ngữ cảnh của agent, phép biến đổi bytecode có thể được mô hình hóa như một hàm:

~~~text
class-file bytes hiện tại
        +
chính sách biến đổi
        ↓
class-file bytes mới
~~~

Instrumentation không yêu cầu agent phải tự phân tích constant pool hay opcode bằng tay. Nó chỉ yêu cầu transformer trả về bytes hợp lệ. Lớp kỹ nghệ bytecode có nhiệm vụ:

- phân tích đầu vào;
- tìm method/instruction cần chỉnh;
- thêm/xóa/thay code theo chính sách;
- cập nhật metadata/stack maps khi cần;
- tạo class-file bytes mới.

Ví dụ timing probe:

~~~text
điểm vào method
→ ghi thời điểm bắt đầu

mọi đường thoát bình thường hoặc bằng exception
→ ghi thời lượng
~~~

Điểm khó không nằm ở vài opcode riêng lẻ mà ở việc giữ luồng điều khiển, trạng thái stack/local và các bất biến của class file hợp lệ.
