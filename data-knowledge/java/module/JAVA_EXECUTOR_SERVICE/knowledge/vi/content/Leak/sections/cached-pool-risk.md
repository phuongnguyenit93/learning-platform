`newCachedThreadPool()` có khả năng mở rộng số platform worker lớn khi task tới nhanh và chưa có worker rảnh.

Nếu workload block lâu và submission rate cao, số native Thread có thể tăng mạnh.

Hệ quả có thể gồm:

- memory tăng;
- context switching tăng;
- scheduler overhead;
- cuối cùng có thể gặp lỗi tạo native Thread mới.

Không nên coi cached pool là "pool tự tối ưu nên luôn an toàn".

### Platform Thread: memory và context-switching cost

Platform Thread không miễn phí. Một Thread sống có thể đi kèm:

- native/JVM bookkeeping;
- stack reservation/commit tùy JVM/OS/configuration;
- scheduling state;
- references reachable từ stack hoặc ThreadLocal.

Vì vậy không nên reasoning kiểu:

```text
1 Thread khá nhẹ
→ 100.000 platform threads cũng chỉ là 100.000 lần "khá nhẹ"
→ chắc chắn ổn
```

CPU core cũng hữu hạn. Khi số **runnable** platform threads lớn hơn rất nhiều số core:

```text
nhiều runnable threads
        ↓
OS/JVM scheduler chia CPU time
        ↓
execution context được chuyển qua lại
        ↓
thêm scheduling/context-switch overhead
+ cache locality có thể xấu đi
        ↓
throughput / tail latency có thể xấu hơn
```

Context switch bản thân không phải bug và không phải lúc nào cũng đắt như nhau. Thread đang block cũng khác Thread liên tục runnable. Vì vậy không dùng một con số "N threads là quá nhiều" cho mọi machine/workload.

Khi nghi ngờ thread pressure, quan sát bằng thread count/state, CPU, scheduler/OS metrics và JFR/profiler thay vì kết luận chỉ từ cấu hình `maxPoolSize`.

Đây cũng là lý do Virtual Thread ở chapter sau tập trung giảm chi phí của mô hình thread-per-task cho workload blocking phù hợp; nó không làm CPU core hay downstream resource trở thành vô hạn.
