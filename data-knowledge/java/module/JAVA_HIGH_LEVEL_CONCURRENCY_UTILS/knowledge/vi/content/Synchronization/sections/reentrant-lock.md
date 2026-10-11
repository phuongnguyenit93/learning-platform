`ReentrantLock` cung cấp cùng mục tiêu mutual exclusion nhưng thêm các khả năng điều khiển mà `synchronized` không có trực tiếp:

- `tryLock()`;
- `tryLock(timeout, unit)`;
- `lockInterruptibly()`;
- fairness option;
- nhiều `Condition` trên cùng một lock.

Rule quan trọng:

```java
lock.lock();
try {
    // critical section
} finally {
    lock.unlock();
}
```

Nếu quên `unlock()`, lock có thể bị giữ vô thời hạn.

### Vì sao gọi là Reentrant?

Reentrant nghĩa là **Thread đang giữ lock có thể acquire lại chính lock đó** mà không tự deadlock.

`ReentrantLock` theo dõi hold count:

```text
lock() lần 1 → holdCount = 1
lock() lần 2 → holdCount = 2
unlock()      → holdCount = 1
unlock()      → holdCount = 0
```

Intrinsic monitor của `synchronized` cũng có tính reentrant.

Tham khảo:

```text
SynchronizationController#reentrantLock()
GET /synchronization/reentrant-lock
```

**Kết luận:** reentrancy cho phép một call chain trên cùng Thread đi qua nhiều method cùng acquire một lock mà không tự khóa chính mình; nhưng số lần release vẫn phải khớp số lần acquire.

### tryLock demo

Tham khảo:

```text
SynchronizationController#tryLock()
GET /synchronization/try-lock
```

Worker A giữ lock. Worker B chỉ chờ một khoảng hữu hạn bằng `tryLock(timeout)`.

Điểm cần quan sát:

```text
holderAcquired = true
contenderAcquiredWhileHeld = false
workersTerminated = true
```

**Kết luận:** `tryLock` cho phép xây dựng timeout/fallback thay vì chờ lock vô hạn.

### lockInterruptibly demo

Tham khảo:

```text
SynchronizationController#interruptibleLock()
GET /synchronization/interruptible-lock
```

Một worker đang chờ lock bằng `lockInterruptibly()` được gửi interrupt.

Kết quả kỳ vọng:

```text
waiterInterrupted = true
waiterAcquired = false
```

**Kết luận:** explicit lock có thể hỗ trợ cancellation trong lúc chờ lock.

### Fair và unfair lock

`new ReentrantLock(true)` yêu cầu fairness policy mạnh hơn bản mặc định.

Fairness không nên được đánh giá bằng thứ tự vài dòng log. Scheduler và thời điểm Thread thực sự gọi `lock()` có thể khác thứ tự `start()`.

Fair lock thường đổi throughput lấy khả năng hạn chế barging/starvation. Cần benchmark theo workload thật nếu lựa chọn này quan trọng.

Không nên dùng một benchmark vài trăm hay vài nghìn Thread rồi kết luận tuyệt đối rằng:

```text
fair = không bao giờ starvation
unfair = chắc chắn starvation
```

Fairness là **acquisition policy** của lock, không phải lời hứa về thứ tự `Thread.start()`, thứ tự scheduler chạy Thread hay thứ tự log xuất hiện.

Một footgun quan trọng: với fair `ReentrantLock`, `tryLock()` **không timeout** không bắt buộc tuân theo fairness policy. Nó có thể acquire ngay nếu lock đang available dù có Thread khác đã chờ lâu hơn. Ngược lại, timed `tryLock(timeout, unit)` honor fairness policy của fair lock khi phải xếp hàng chờ.

Mental model:

```text
new ReentrantLock(true)
→ lock()/lockInterruptibly()/timed tryLock() dùng fair admission policy phù hợp

untimed tryLock()
→ opportunistic immediate acquisition
→ có thể barge
```

Vì vậy không dùng untimed `tryLock()` rồi suy luận rằng mọi acquisition của fair lock đều FIFO-like.

### Fair/unfair policy demo

Tham khảo:

```text
SynchronizationController#reentrantLockPolicy()
GET /synchronization/reentrant-lock-policy
```

Experiment cố ý không benchmark timing. Nó chỉ quan sát contract cấu hình:

```text
defaultIsFair = false
explicitUnfairIsFair = false
explicitFairIsFair = true
untimedTryLockHonorsFairness = false
timedTryLockHonorsFairness = true
fairnessGuaranteesThreadStartOrder = false
fairnessEliminatesSchedulingVariance = false
fairnessHasPotentialThroughputCost = true
```

**Kết luận:** dùng fairness khi semantics về giảm barging/starvation đáng giá hơn throughput cost; nếu performance quan trọng phải benchmark workload thật, không suy từ vài lần chạy endpoint.
