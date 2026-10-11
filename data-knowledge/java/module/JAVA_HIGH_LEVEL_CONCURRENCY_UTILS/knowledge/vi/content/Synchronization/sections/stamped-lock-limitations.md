`StampedLock` có một số semantics quan trọng cần nhớ:

- **không reentrant**: Thread đang giữ write lock không được giả định có thể acquire lại như `ReentrantLock`;
- các `Lock` view của `StampedLock` không cung cấp `Condition`;
- programmer phải quản lý `long stamp` và unlock đúng mode;
- optimistic read luôn cần `validate(stamp)` trước khi tin snapshot;
- khi cancellation/interrupt quan trọng, cần chọn API interruptible phù hợp thay vì mặc định mọi acquisition đều cancellable.

Tham khảo:

```text
SynchronizationController#stampedLockLimitations()
GET /synchronization/stamped-lock-limitations
```

Experiment giữ write lock rồi gọi `tryWriteLock()` lần nữa trên cùng Thread. Vì lock không reentrant, lần thử thứ hai không thành công. Experiment cũng gọi `newCondition()` qua read-lock view và quan sát operation không được support.

```text
sameThreadReentrantTryWriteLockSucceeded = false
reentrant = false
conditionSupported = false
```

**Kết luận:** chỉ dùng `StampedLock` khi optimistic/read semantics thật sự đáng giá hơn complexity tăng thêm.
