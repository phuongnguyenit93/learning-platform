`LockSupport.park()` tạm dừng Thread và `unpark(thread)` cấp permit cho Thread đích danh.

Điểm khác biệt hữu ích so với `notify()`:

- không cần giữ intrinsic monitor;
- `unpark` chỉ định chính xác Thread;
- permit có thể được cấp trước khi Thread gọi `park()`.

Permit của `LockSupport` không phải counter cộng dồn vô hạn. Mental model gần với một trạng thái "có permit / chưa có permit": nhiều lần `unpark(thread)` trước một lần `park()` không tích lũy thành nhiều lượt park trong tương lai đều tự đi qua.

`park()` cũng có interruption semantics khác các API như `sleep()`/`wait()`:

```text
park()
→ có thể return vì permit / unpark
→ có thể return vì Thread bị interrupt
→ có thể spurious return

park()
→ không ném InterruptedException
→ caller phải tự kiểm tra predicate và/hoặc interrupt status
```

Vì vậy pattern thực tế vẫn là một loop quanh condition/cancellation state, không phải gọi `park()` một lần rồi mặc định rằng nguyên nhân return chắc chắn là `unpark()`.

Một điểm cần lưu ý khác: permit có thể được cấp **sau khi Thread đã start nhưng trước lần `park()` tương ứng**. Không nên mở rộng câu đó thành guarantee rằng gọi `unpark(thread)` trên một Thread **chưa start** sẽ lưu permit cho lần chạy tương lai.

Khi xây primitive/framework thấp hơn, overload `park(blocker)` hữu ích cho diagnostics. JVM có thể expose blocker object qua `LockSupport.getBlocker(thread)`, giúp thread dump/debugging cho biết Thread đang park thay mặt cho abstraction nào thay vì chỉ thấy một điểm park mơ hồ.

Tham khảo:

```text
CoordinationController#lockSupport()
GET /coordination/lock-support
```

Demo park ba worker. Hai worker đầu dùng predicate loop để chứng minh targeted `unpark`; worker thứ ba được interrupt trong lúc park để quan sát interruption semantics. Kết quả chính:

```text
targetedWorkerResumed = true
otherWorkerStillParked = true
parkReturnedWhenInterrupted = true
interruptStatusObservedAfterPark = true
parkThrowsInterruptedException = false
blockerVisibleWhileParked = true
```

Sau đó experiment `unpark(first)` và cleanup toàn bộ worker trước khi return.

Điều này chứng minh trực tiếp rằng `unpark(thread)` target một Thread cụ thể, còn interrupt là một reason khác làm `park()` return. Permit pre-issue (`unpark` sau start nhưng trước `park`) vẫn là semantics hợp lệ của `LockSupport`, nhưng không dùng làm bằng chứng duy nhất vì `park()` cũng cho phép spurious return.
