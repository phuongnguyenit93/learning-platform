Notification không phải proof rằng condition đã đúng.

Pattern:

```java
synchronized (monitor) {
    while (!ready) {
        monitor.wait();
    }
}
```

giúp xử lý:

- spurious wakeup;
- nhiều waiter cạnh tranh;
- state có thể thay đổi trước khi waiter reacquire monitor.

Với `LockSupport.park()` cũng cần condition/cancellation loop. `park()` có thể return vì permit, interrupt hoặc spurious return và không ném `InterruptedException`; caller phải tự kiểm tra interrupt status/predicate.
