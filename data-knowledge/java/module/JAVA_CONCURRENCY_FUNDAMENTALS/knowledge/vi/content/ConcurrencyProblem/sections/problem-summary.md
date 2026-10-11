| Nhóm vấn đề | Câu hỏi | Ví dụ |
| --- | --- | --- |
| Atomicity | Một operation có bị xen giữa không? | lost update với `count++` |
| Visibility | Thread khác có được đảm bảo thấy write không? | stale flag/data |
| Ordering | Các action được Thread khác quan sát theo guarantee nào? | publication không có happens-before |
| Progress | Thread/system có tiếp tục hoàn thành công việc không? | deadlock, livelock, starvation |

Mental model cuối cùng:

```text
Concurrency correctness
    ├── state correctness
    │      ├── atomicity
    │      ├── visibility
    │      └── ordering
    │
    └── progress / liveness
           ├── deadlock
           ├── livelock
           └── starvation
```

Không có một keyword duy nhất giải quyết mọi vấn đề.

Chapter tiếp theo mới bắt đầu học các công cụ cụ thể:

```text
synchronized
Lock
Atomic
Concurrent Collection
...
```
