`Object.wait()` chỉ được gọi khi Thread đang giữ monitor tương ứng.

Khi gọi `wait()`:

```text
Thread giữ monitor
→ wait()
→ release monitor
→ vào wait set
```

`notify()` đánh thức một waiter; `notifyAll()` đánh thức tất cả waiter để chúng cạnh tranh lấy lại monitor.

Ba rule dễ nhầm:

1. `wait()`, `notify()` và `notifyAll()` phải thao tác khi caller đang sở hữu monitor tương ứng; nếu không có thể nhận `IllegalMonitorStateException`.
2. `wait()` release monitor trong thời gian chờ, nhưng `Thread.sleep()` **không release monitor** chỉ vì Thread đang ngủ.
3. `notify()`/`notifyAll()` không chuyển monitor ngay cho waiter. Waiter được đánh thức vẫn phải chờ notifier rời `synchronized`/release monitor rồi mới có thể reacquire và tiếp tục.

### Luôn chờ bằng predicate loop

Pattern đúng:

```java
synchronized (monitor) {
    while (!condition) {
        monitor.wait();
    }
    // condition đã đúng
}
```

Không dùng `if` chỉ để kiểm tra một lần. Thread có thể tỉnh dậy nhưng condition chưa phù hợp, và Java cho phép spurious wakeup.

Tham khảo:

```text
CoordinationController#waitNotify()
GET /coordination/wait-notify
```

Experiment đảm bảo waiter thực sự vào wait set trước khi notifier cập nhật predicate và gọi `notifyAll()`.

Demo dùng ba waiter để quan sát riêng hai bước:

```text
notify()
→ chỉ một waiter được đánh thức để kiểm tra lại predicate
→ predicate vẫn false nên waiter quay lại chờ

ready = true + notifyAll()
→ toàn bộ waiter được đánh thức
→ từng Thread cạnh tranh acquire lại monitor
→ tất cả hoàn thành vì predicate đã true
```

**Kết luận:** notification chỉ là tín hiệu "hãy kiểm tra lại"; predicate mới quyết định có được tiếp tục hay không.
