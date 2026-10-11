### newFixedThreadPool(n)

Số worker cố định. Factory này dùng unbounded `LinkedBlockingQueue`, vì vậy backlog có thể tăng lớn nếu producer nhanh hơn consumer lâu dài.

### newCachedThreadPool()

Pool có thể tăng worker mạnh và dùng `SynchronousQueue`. Phù hợp cho task ngắn trong một số workload nhưng cần hiểu risk tạo nhiều platform threads.

### newSingleThreadExecutor()

Một worker, giúp serialize task theo queue của executor.

Factory này cũng dùng queue không bounded theo một application capacity nhỏ do caller cấu hình. Nếu producer submit nhanh hơn single worker xử lý trong thời gian dài, backlog/memory/latency vẫn có thể tăng mạnh. "Một worker" không đồng nghĩa "tự có backpressure".

### newScheduledThreadPool(n)

Hỗ trợ delayed/periodic execution.

Không chọn factory chỉ vì tên tiện; trong production thường cần hiểu rõ queue, worker limit và rejection behavior thật sự.

Tham khảo:

```text
ThreadPoolController#fixedPoolReuse()
GET /thread-pool/fixed-pool-reuse

ThreadPoolController#executorFactories()
GET /thread-pool/executor-factories
```

`fixed-pool-reuse` gửi nhiều task nhưng chỉ quan sát tối đa hai worker name, cho thấy worker được reuse thay vì tạo Thread cho từng task.

`executor-factories` chạy bốn experiment bounded để quan sát semantics đại diện:

```text
newFixedThreadPool(2)
→ hai worker giữ task đang chạy
→ task dư chờ queue

newCachedThreadPool()
→ khi chưa có idle worker, nhiều task đồng thời có thể làm pool tăng worker

newSingleThreadExecutor()
→ task được serialize theo submission order của queue

newScheduledThreadPool(1)
→ task được chạy sau delay mà không cần tự viết sleep-loop
```

Các executor đều được shutdown/awaitTermination trong chính experiment để request không để lại worker sống.
