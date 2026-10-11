`ReentrantReadWriteLock` mặc định là **non-fair**; có thể tạo fair lock bằng:

```java
new ReentrantReadWriteLock(true);
```

Fairness không có nghĩa `Thread.start()` trước chắc chắn acquire trước. Nó liên quan policy phục vụ các Thread đang cạnh tranh lock, và đổi lại thường có throughput cost.

Tương tự `ReentrantLock`, các non-blocking `tryLock()` của `ReadLock`/`WriteLock` không nên được dùng như bằng chứng rằng fair mode luôn được honor ở mọi acquisition API. Chúng có thể acquire ngay nếu lock state cho phép, bất kể waiter đang xếp hàng. Nếu fairness là requirement của protocol, phải chọn acquisition API có semantics phù hợp thay vì chỉ dựa vào constructor `new ReentrantReadWriteLock(true)`.

Với workload read-heavy, non-fair policy có thể cho throughput tốt nhưng writer có thể phải chờ lâu nếu reader liên tục xuất hiện. Vì vậy không nên chọn `ReadWriteLock` chỉ vì nghe rằng "nhiều reader chạy song song".

Nó đáng cân nhắc khi:

- read nhiều hơn write đáng kể;
- critical section đọc đủ lớn để concurrency mang lại lợi ích;
- contention thật sự tồn tại;
- benchmark/workload cho thấy lợi ích lớn hơn overhead quản lý hai loại lock.

Tham khảo:

```text
SynchronizationController#readWriteLockPolicy()
GET /synchronization/read-write-lock-policy
```

Experiment không cố chứng minh fairness bằng thứ tự log. Nó quan sát trực tiếp policy được cấu hình:

```text
defaultIsFair = false
explicitFairIsFair = true
untimedReadTryLockHonorsFairness = false
untimedWriteTryLockHonorsFairness = false
fairnessGuaranteesThreadStartOrder = false
```

**Kết luận:** fairness là policy, không phải benchmark shortcut; starvation/throughput phải được đánh giá theo workload thật.
