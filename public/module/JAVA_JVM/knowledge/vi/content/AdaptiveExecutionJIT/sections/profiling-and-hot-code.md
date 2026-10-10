Runtime profiling thu thập thông tin về code thực sự chạy: method nào được gọi nhiều, branch nào thường được chọn, type nào thường xuất hiện ở call site và nhiều signal khác tùy implementation.

Từ đó runtime có thể xác định **hot code** — phần code đáng để dành compiler effort.

Điểm mạnh của runtime optimization là compiler có bằng chứng mà static compiler trước runtime chưa chắc có:

```text
source-level possibility
≠ hành vi quan sát được ở runtime
```

Nhưng profiling data có thể thay đổi theo workload. Optimization dựa trên assumption runtime vì vậy phải có cơ chế deoptimization khi assumption không còn đúng.
