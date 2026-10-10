Class file bắt đầu là một biểu diễn nhị phân: version, constant pool, fields, methods và attributes.

Khi runtime cần type:

```text
class-file representation
→ load/create runtime class
→ verify + prepare (+ resolve khi cần)
→ runtime constant pool / class metadata
→ initialize static state khi trigger
```

Sau đó instruction execution có thể sử dụng resolved runtime entities thay vì chỉ symbolic entries.

Đây là bridge giữa chapter 2 và chapter 3: dữ liệu “trong file” trở thành runtime structures phục vụ execution.
