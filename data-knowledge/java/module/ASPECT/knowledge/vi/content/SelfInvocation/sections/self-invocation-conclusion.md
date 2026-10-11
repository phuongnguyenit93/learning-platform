Khi AOP không chạy, câu hỏi đầu tiên nên là:

```text
invocation này có thực sự đi qua proxy không?
```

Thường nên refactor boundary giữa các bean thay vì tìm cách lách proxy model bằng hidden self-reference.
