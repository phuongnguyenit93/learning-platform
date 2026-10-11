Một virtual thread gọi blocking API vẫn **semantically blocked**.

Khác biệt là JVM có thể giải phóng carrier trong lúc virtual thread chờ nếu operation hỗ trợ unmount.

Vì vậy không nên nói:

```text
Virtual Thread = non-blocking programming
```

Đúng hơn:

```text
blocking style code
        +
cheap virtual-thread suspension
        ↓
high concurrency với programming model tuần tự quen thuộc
```
