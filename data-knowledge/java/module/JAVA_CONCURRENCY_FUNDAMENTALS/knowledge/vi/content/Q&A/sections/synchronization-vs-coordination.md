```text
Synchronization
→ ai được chạm shared state tại thời điểm nào?

Coordination
→ Thread nào phải chờ event/phase/Thread khác?
```

`synchronized` bảo vệ counter là synchronization.

`CountDownLatch` đợi hai worker hoàn thành là coordination.

Một chương trình thực tế thường dùng cả hai.

### Fair lock có nghĩa mọi cách acquire đều fair không?

Không. Ví dụ `new ReentrantLock(true)` cấu hình fair lock, nhưng untimed `tryLock()` vẫn là opportunistic acquisition và có thể barge nếu lock đang available. Timed `tryLock(timeout, unit)` mới tham gia fair ordering policy khi phải chờ. Với `ReentrantReadWriteLock`, non-blocking `ReadLock.tryLock()` / `WriteLock.tryLock()` cũng không nên được coi là fairness-preserving admission.
