Leak/lifecycle bug cũng có thể xuất hiện khi application vô tình tạo nhiều scheduler hoặc đăng ký cùng periodic job nhiều lần.

Triệu chứng:

```text
một job logic
→ chạy 2, 3, 4 lần mỗi chu kỳ
```

Phải kiểm soát ownership của scheduler và registration lifecycle.
