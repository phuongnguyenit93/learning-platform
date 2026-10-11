Các công thức kiểu:

```text
CPU-bound → khoảng Ncpu
I/O-bound → lớn hơn Ncpu
```

chỉ là điểm khởi đầu.

Sizing production nên dựa vào:

- arrival rate;
- service time;
- latency SLO;
- downstream capacity;
- memory cho queued task;
- contention;
- behavior khi overload.

Không có `queueCapacity = 500` hay `maxPoolSize = Ncpu * 2` đúng cho mọi hệ thống.
