Annotation phù hợp khi thông tin:

- gắn tự nhiên với class, method, field, parameter hoặc type;
- tương đối ổn định;
- mang tính khai báo hơn là thuật toán;
- cần trình biên dịch, công cụ hoặc framework đọc;
- nên nằm gần mã nguồn để thay đổi cùng mã nguồn khi tái cấu trúc (refactor).

Ví dụ:

```text
method này là test
class này ánh xạ tới một loại dữ liệu
field này có quy tắc kiểm tra hợp lệ
method này cần audit
API này đã deprecated
```

Điểm chung của các ví dụ trên là Annotation đang trả lời câu hỏi:

```text
"Thành phần mã nguồn này có đặc điểm hay ý nghĩa gì?"
```

chứ không trực tiếp mô tả từng bước thuật toán phải chạy.

Annotation thường là lựa chọn tốt khi có một thành phần đọc rõ ràng:

```text
siêu dữ liệu
   ↓
thành phần đọc hiểu quy tắc
   ↓
thành phần đọc kiểm tra / sinh mã / đăng ký / tạo hành vi
```

Nếu không xác định được **ai đọc Annotation** và **đọc để làm gì**, Annotation rất dễ trở thành một nhãn không có quy tắc rõ ràng.
