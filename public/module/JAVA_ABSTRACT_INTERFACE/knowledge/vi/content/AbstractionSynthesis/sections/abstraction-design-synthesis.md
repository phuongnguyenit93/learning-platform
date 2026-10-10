Có thể đi theo chuỗi câu hỏi sau:

```text
Bên sử dụng chỉ cần một hợp đồng/khả năng chung?
→ ưu tiên interface

Một họ lớp có quan hệ gần và cần trạng thái + quy tắc khởi tạo + phần triển khai chung?
→ cân nhắc abstract class

Một lớp cần đảm nhận nhiều vai trò độc lập?
→ dùng nhiều interface

Cần hợp đồng linh hoạt nhưng một nhánh triển khai vẫn muốn dùng lại phần chung?
→ interface + lớp cha trừu tượng

Interface cần ghép nhiều hợp đồng nhỏ?
→ kế thừa interface

Interface cần hành vi mặc định cho đối tượng?
→ dùng default

Cần thao tác thuộc chính kiểu interface?
→ dùng static

Cần tái sử dụng chi tiết triển khai nội bộ?
→ dùng private / private static

Nhiều phương thức `default` cạnh tranh?
→ áp dụng quy tắc về độ cụ thể, ưu tiên hệ phân cấp lớp và ghi đè tường minh
```

Mục tiêu là chọn cơ chế từ **nhu cầu của mô hình**, không từ thói quen cú pháp.
