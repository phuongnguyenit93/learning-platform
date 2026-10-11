`ThreadFactory` cho phép kiểm soát cách worker Thread được tạo, đặc biệt hữu ích cho:

- thread name prefix;
- daemon policy khi thật sự cần;
- uncaught exception handling;
- observability/thread dump.

Tên như:

```text
payment-worker-1
payment-worker-2
```

hữu ích hơn nhiều so với `pool-7-thread-3` khi debug production.
