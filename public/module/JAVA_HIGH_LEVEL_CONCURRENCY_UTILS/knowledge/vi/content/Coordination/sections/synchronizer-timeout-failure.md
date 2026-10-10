Happy-path demo chưa đủ để sử dụng synchronizer an toàn. Cần hiểu điều gì xảy ra khi một participant không đến đúng hạn.

Tham khảo:

```text
CoordinationController#synchronizersTimeout()
GET /coordination/synchronizers-timeout
```

Endpoint minh họa bounded:

```text
CountDownLatch.await(timeout)
→ false khi caller hết thời gian chờ
→ worker thật vẫn tiếp tục chạy và hoàn thành bình thường

CyclicBarrier participant timeout
→ barrier broken
→ reset() đưa barrier về generation mới
→ generation kế tiếp có thể chạy thành công với participant mới

Semaphore acquire(2) + tryAcquire(timeout)
→ timeout nếu không còn permit

Phaser arrive / arriveAndAwaitAdvance / deregister
→ một participant rời sau phase 0
→ participant còn lại tiếp tục phase 1
→ thể hiện dynamic registration/deregistration

Phaser coordinator
→ dùng awaitAdvanceInterruptibly(..., timeout, ...)
→ bounded wait và phản ứng được với interruption

Exchanger không có partner
→ timed exchange ném TimeoutException

Exchanger đang chờ partner
→ interrupt làm blocking exchange kết thúc bằng InterruptedException
```

Riêng latch demo, worker được giữ bằng một latch khác và chỉ được release **sau khi caller đã quan sát timeout**. Không dùng chênh lệch hai khoảng `sleep()` để giả định timeout chắc chắn xảy ra.

Các trường cần quan sát trong `countDownLatch`:

```text
completedBeforeTimeout = false
workerContinuedAfterCallerTimeout = true
workerTerminatedNormally = true
```

Nếu caller bị interrupt hoặc bước quan sát thất bại, service vẫn giải phóng gate và cleanup worker trong `finally`. Với Phaser, coordinator dùng timed interruptible wait; đường cleanup force-terminate Phaser để worker không kẹt ở phase chưa đủ participant. Với Exchanger, experiment chạy cả timed wait và interrupt path để không để participant chờ partner vô hạn.

**Kết luận:** timeout không chỉ là "đợi ít hơn"; mỗi primitive có failure state và recovery semantics riêng.
