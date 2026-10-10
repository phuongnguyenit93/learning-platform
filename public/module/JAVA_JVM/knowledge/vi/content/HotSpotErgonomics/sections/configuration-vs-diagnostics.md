Tuning trước khi có bằng chứng thường tạo vòng lặp:

```text
thấy latency cao
→ đổi GC flag
→ đổi heap
→ đổi compiler flag
→ không biết thay đổi nào thực sự giúp
```

Hãy chuyển sang diagnostics khi câu hỏi trở thành:

- pause thật sự đến từ GC không?
- allocation rate/live set là bao nhiêu?
- thread đang block ở đâu?
- native memory category nào tăng?
- code có compile/deopt bất thường không?

JVM theory giúp đặt hypothesis. Runtime Diagnostics dùng JFR, `jcmd`, GC logs, heap/thread dump, NMT và metrics để kiểm chứng.

Nguyên tắc: **measure → explain → change → measure again**.
