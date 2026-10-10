### CountDownLatch

Một hoặc nhiều Thread chờ counter về 0.

```text
new CountDownLatch(N)
workers countDown()
coordinator await()
```

Latch là one-shot: counter đã về 0 thì không reset để dùng vòng mới.

`await(timeout, unit)` trả `false` khi hết thời gian mà counter chưa về 0. Timeout của Thread đang chờ **không tự cancel** các worker đang chạy.

### CyclicBarrier

Một nhóm Thread cùng chờ nhau tại barrier. Khi đủ parties, cả nhóm tiếp tục. Barrier có thể tái sử dụng qua nhiều generation nếu không bị broken.

Nếu một participant timeout/interrupted trong lúc chờ, barrier có thể chuyển sang trạng thái **broken**. Các participant khác có thể nhận `BrokenBarrierException`. `reset()` tạo generation mới nhưng chỉ nên dùng khi application đã hiểu rõ state của các participant cũ.

Barrier còn có thể nhận một `barrierAction`, chạy khi party cuối cùng tới checkpoint trước khi các party được release.

### Semaphore

Semaphore quản lý số permit, phù hợp để giới hạn concurrent access tới một resource có capacity hữu hạn.

Rule cleanup:

```java
boolean acquired = false;
try {
    semaphore.acquire();
    acquired = true;
    // use resource
} finally {
    if (acquired) {
        semaphore.release();
    }
}
```

Không `release()` nếu chưa acquire thành công.

### Fair và non-fair Semaphore

`new Semaphore(n)` mặc định non-fair. `new Semaphore(n, true)` chọn fairness cho các acquisition có áp dụng policy này, theo thứ tự tới điểm xếp hàng nội bộ. Nó không bảo đảm thứ tự `Thread.start()` hay thứ tự log.

Fairness giúp hạn chế barging/starvation khi tranh chấp permit, nhưng có thể giảm throughput. Đặc biệt, `tryAcquire()` **không timeout** không tuân theo fairness: nó có thể lấy permit ngay dù đã có Thread khác chờ. Không suy luận policy chỉ từ tên constructor.

Experiment `synchronizers()` bên dưới tập trung vào giới hạn concurrent access và hoàn trả permit; nó không phải phép đo fairness. Đây là tiêu chí chọn policy, không phải kết luận từ thứ tự vài dòng output.

Tham khảo: [Semaphore — Java 21](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Semaphore.html).

Điểm rất quan trọng: `Semaphore` không enforce ownership giống lock. Code có thể gọi `release()` dù Thread hiện tại không phải Thread đã acquire permit. Vì vậy unmatched `release()` có thể làm permit count tăng sai và phá giới hạn concurrency.

Ngoài `acquire()`, các API đáng nhớ gồm:

```text
acquire(n)
tryAcquire()
tryAcquire(timeout)
```

Chúng giúp biểu diễn resource cần nhiều permit hoặc admission có timeout.

### Phaser

`Phaser` phù hợp cho coordination nhiều phase và số participant có thể register/deregister động.

Các operation quan trọng:

```text
register()
arrive()
arriveAndAwaitAdvance()
arriveAndDeregister()
```

Khác `CountDownLatch`, Phaser có thể tiến qua nhiều phase và participant có thể thay đổi theo lifecycle của workflow.

Các API chờ phase không có cùng interruption semantics:

```text
awaitAdvance(...)
→ chờ phase advance
→ không phải interruptible wait API

awaitAdvanceInterruptibly(...)
→ phản ứng với interrupt

awaitAdvanceInterruptibly(..., timeout, unit)
→ phản ứng với interrupt + có bounded timeout
```

Vì vậy nếu coordinator phải hỗ trợ cancellation/timeout, hãy chọn interruptible/timed API thay vì chỉ nhìn tên `await`.

### Exchanger

Hai Thread gặp nhau tại một exchange point và trao đổi object cho nhau.

Nếu partner không tới, `exchange(value)` có thể chờ. Khi workflow cần bounded waiting, dùng timed overload:

```java
exchange(value, timeout, unit)
```

Semantics quan trọng:

```text
partner tới
→ exchange thành công

partner không tới trước deadline
→ TimeoutException

Thread đang chờ bị interrupt
→ InterruptedException
```

Tham khảo:

```text
CoordinationController#synchronizers()
GET /coordination/synchronizers
```

Endpoint chạy các example nhỏ, bounded và trả về một result map để thấy semantics của từng synchronizer.
