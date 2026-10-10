Với `ThreadPoolExecutor`, khi gọi `execute(task)`, mental model cốt lõi là:

```text
worker count < corePoolSize ?
        ├─ yes → tạo core worker chạy task
        └─ no
            ↓
        thử enqueue task
            ├─ thành công → task chờ trong queue
            └─ queue full
                ↓
        worker count < maximumPoolSize ?
            ├─ yes → tạo worker bổ sung
            └─ no  → rejection policy
```

Điều này khác với câu:

> queue đầy thì `execute()` tự block caller cho đến khi có chỗ.

`ThreadPoolExecutor.execute()` không có contract đó. Nếu muốn backpressure ở caller, cần chọn policy/architecture phù hợp.

### Demo flow

Tham khảo:

```text
ThreadPoolController#executorFlow()
GET /thread-pool/executor-flow
```

Pool demo dùng cấu hình nhỏ:

```text
core = 1
max = 2
queue = 1
AbortPolicy
```

Các task được giữ lại bằng latch để quan sát lần lượt:

```text
task 1 → core worker
task 2 → queue
task 3 → worker thứ 2 vì queue đầy
task 4 → rejected
```

**Kết luận:** `maximumPoolSize` chỉ có cơ hội phát huy khi queue không còn nhận task mới.
