Worker pool được tạo một lần rồi reuse:

```text
parent context = USER_A
submit task 1
        ↓
worker-1 được tạo → inherit USER_A

parent context = USER_B
submit task 2
        ↓
vẫn worker-1 cũ
→ không có child Thread mới để inherit USER_B
```

Tham khảo:

```text
ThreadLocalController#poolReuseProblem()
GET /context/pool-reuse-problem
```

Kết quả kỳ vọng:

```text
task1 = USER_A
task2 = USER_A
parent = USER_B
```

Đây là stale context do worker reuse.
