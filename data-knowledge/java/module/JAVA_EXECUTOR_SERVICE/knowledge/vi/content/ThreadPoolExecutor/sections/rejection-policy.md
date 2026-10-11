Task bị reject khi executor vẫn RUNNING nhưng không còn worker/queue capacity phù hợp, hoặc khi executor đã shutdown.

Các policy mặc định:

| Policy | Hành vi |
| --- | --- |
| `AbortPolicy` | ném `RejectedExecutionException` |
| `CallerRunsPolicy` | caller tự chạy task nếu executor chưa shutdown |
| `DiscardPolicy` | bỏ task im lặng |
| `DiscardOldestPolicy` | loại bỏ task ở **head của work queue** rồi thử submit task mới lại |

### CallerRunsPolicy như một dạng feedback/backpressure

Tham khảo:

```text
ThreadPoolController#callerRuns()
GET /thread-pool/caller-runs
```

Pool được làm đầy có chủ đích. Task tiếp theo chạy ngay trên caller thread.

Điểm cần quan sát:

```text
fallbackThread = HTTP/caller thread
```

Caller bị bận tự xử lý task, vì vậy tốc độ submit giảm. Đây là feedback pressure, không phải queue tự block `execute()`.

`DiscardPolicy` và `DiscardOldestPolicy` chỉ nên dùng khi semantics mất task được hiểu và chấp nhận rõ ràng.

### DiscardPolicy và DiscardOldestPolicy: mất task là business semantics

`DiscardPolicy` bỏ task mới mà không ném exception. `DiscardOldestPolicy` gọi theo semantics của **head work queue** rồi thử submit task mới lại.

Với FIFO queue như `LinkedBlockingQueue` trong experiment này, head cũng chính là task đã nằm trong queue lâu nhất. Nhưng không nên biến điều đó thành contract tổng quát: nếu work queue có ordering khác, ví dụ priority ordering, head phụ thuộc semantics của queue chứ không nhất thiết là task "cũ nhất theo thời gian".

Điều này có nghĩa chúng không chỉ là "cách xử lý kỹ thuật khi pool đầy". Chúng thay đổi **task nào được phép biến mất**.

Tham khảo:

```text
ThreadPoolController#discardPolicies()
GET /thread-pool/discard-policies
```

Experiment làm đầy pool/queue bằng latch rồi quan sát:

```text
DiscardPolicy
→ task mới không chạy và không có exception

DiscardOldestPolicy
→ head của LinkedBlockingQueue trong demo không chạy
→ task mới thay thế và được thực thi
```

**Kết luận:** chỉ chọn discard policy khi application có rule rõ ràng về việc bỏ dữ liệu/công việc; nếu mất task là không chấp nhận được, policy này không phù hợp.
