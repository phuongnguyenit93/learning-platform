Một production pipeline cần nghĩ đến:

- timeout;
- cancellation;
- propagation của interruption/cancellation tới underlying work;
- partial failure;
- cleanup.

Các API như `orTimeout(...)` và `completeOnTimeout(...)` giúp biểu diễn timeout ở stage level, nhưng không nên mặc định rằng timeout của future sẽ cưỡng bức mọi blocking operation bên dưới dừng ngay.

Phân biệt ba việc:

```text
get(timeout)
→ chỉ giới hạn thời gian caller chờ result

orTimeout / completeOnTimeout
→ thay đổi completion semantics của CompletableFuture

Future.cancel(true)
→ cancellation request có thể đi kèm interruption của running task

CompletableFuture.cancel(true)
→ cancel completion state
→ tham số mayInterruptIfRunning không điều khiển underlying processing của CompletableFuture
```

Không cơ chế nào trong ba dòng trên là một primitive "kill Thread bất kể code đang làm gì".

Tham khảo:

```text
AsyncController#timeoutCancellation()
GET /async/timeout-cancellation
```

Experiment chạy hai case riêng, mỗi case có executor/latch riêng và cleanup bounded:

```text
orTimeout
→ future complete bằng TimeoutException
→ underlying worker không tự nhận interrupt

CompletableFuture.cancel(true)
→ future chuyển sang cancelled state
→ join() ném CancellationException
→ worker đang await vẫn không bị interrupt bởi cancel(true)
→ experiment phải chủ động release underlying work
```

Đây là khác biệt quan trọng với `Future` do `ExecutorService.submit(...)` trả về ở phần trước: không được suy từ chữ `cancel(true)` rằng mọi implementation của `Future` đều có cùng interruption behavior.
