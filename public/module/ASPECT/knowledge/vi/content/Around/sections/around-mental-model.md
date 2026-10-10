```text
around before
    ↓
proceed()
    ↓
target method
    ↓
return / exception
    ↓
around after
```

`ProceedingJoinPoint#proceed()` là bước chuyển quyền thực thi sang advice tiếp theo hoặc target.

Vì vậy `@Around` có thể:

- đo thời gian;
- đọc argument;
- thay đổi argument trước khi tiếp tục invocation;
- quan sát return value;
- thay đổi return value;
- quyết định không gọi target;
- propagate hoặc transform exception.

Quyền kiểm soát lớn cũng đồng nghĩa nguy cơ tạo behavior khó đoán nếu dùng quá mức.
