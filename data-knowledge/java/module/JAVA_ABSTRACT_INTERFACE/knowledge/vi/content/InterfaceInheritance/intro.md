# Kế thừa và kết hợp interface

Một interface có thể mô tả một khả năng nhỏ. Khi hệ thống lớn hơn, các hợp đồng nhỏ có thể được kết hợp thành hợp đồng lớn hơn bằng **kế thừa interface**.

Nếu gom mọi hành vi vào một interface rất lớn, lớp triển khai có thể bị buộc phụ thuộc vào những khả năng nó không thật sự cần. Tách các vai trò nhỏ giúp hợp đồng rõ hơn:

```text
Payable
Refundable
Auditable
```

Sau đó một hợp đồng lớn hơn chỉ ghép những vai trò cần thiết. Vì vậy kế thừa interface không chỉ là cú pháp `extends`; nó là cách **kết hợp các hợp đồng** mà vẫn giữ từng khả năng có phạm vi rõ ràng.
