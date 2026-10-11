Dấu hiệu nên theo dõi:

- live thread count tăng theo thời gian;
- pool count/worker count tăng không quay xuống;
- queue depth tăng liên tục;
- memory tăng cùng backlog;
- CPU tăng do busy loop/context switch;
- shutdown/deploy kéo dài;
- duplicate scheduled execution.

Các công cụ hữu ích:

- thread dump;
- JFR/JDK tooling;
- executor metrics;
- queue depth metrics;
- application logs với thread name;
- OS/container metrics.

### Workflow chẩn đoán bằng thread dump

Thread dump hữu ích nhất khi được dùng để trả lời câu hỏi cụ thể, không phải chỉ chụp một file rồi đếm số dòng.

Một workflow thực tế:

```text
1. phát hiện live thread count tăng bất thường
        ↓
2. chụp nhiều thread dump cách nhau một khoảng thời gian
        ↓
3. group theo thread name / pool prefix
        ↓
4. xem Thread.State và stack trace lặp lại
        ↓
5. xác định owner tạo Thread/pool
        ↓
6. đối chiếu queue depth, executor metrics, request rate
        ↓
7. kiểm tra lifecycle: shutdown/cancel/timeout/cleanup
```

Một dump đơn lẻ chỉ là snapshot. Nhiều snapshot giúp phân biệt:

```text
Thread tạm thời đang bận
vs
Thread bị giữ sống lâu bất thường
```

### Đọc Thread.State đúng cách

Một số pattern thường gặp:

| State/pattern | Câu hỏi nên đặt ra |
| --- | --- |
| Nhiều `RUNNABLE` cùng stack | Có busy loop, CPU hot path hay contention ngoài JVM không? |
| Nhiều `BLOCKED` cùng monitor | Ai đang giữ monitor? Critical section có quá lớn không? |
| Nhiều `WAITING/TIMED_WAITING` trong executor | Đây là worker idle bình thường hay pool không còn owner/lifecycle? |
| Thread name prefix tăng liên tục | Có đang tạo pool mới theo request/job không? |
| Stack giữ cùng application object/context | ThreadLocal/task/reference có lifecycle dài hơn intended không? |

`WAITING` không tự động có nghĩa leak. Một worker của pool sống lâu và chờ queue có thể hoàn toàn bình thường nếu pool đó là resource application-owned và có lifecycle rõ ràng.

Ngược lại, Thread count tăng đều dù request rate quay về bình thường là tín hiệu mạnh hơn nhiều.

### Kết hợp thread dump với executor metrics

Nếu có executor metrics, nên đọc cùng nhau:

```text
poolSize
activeCount
queueSize
completedTaskCount
rejectionCount
```

Ví dụ:

```text
poolSize ổn định
activeCount luôn max
queueSize tăng liên tục
```

thường gợi ý saturation/backlog hơn là thread leak.

Trong khi:

```text
request rate ổn định
nhưng số pool/thread name prefix mới cứ tăng
```

gợi ý ownership/lifecycle bug ở việc tạo executor.

### Tooling thực tế

Tùy môi trường có thể dùng:

- `jcmd <pid> Thread.print`;
- `jstack <pid>`;
- Java Flight Recorder / JDK Mission Control;
- Spring Boot Actuator metrics nếu executor được instrument;
- container/OS process metrics.

Mục tiêu cuối cùng không phải tìm "Thread nào trông lạ", mà phải nối được chuỗi:

```text
symptom
→ resource
→ owner
→ missing/incorrect lifecycle rule
→ fix
```
