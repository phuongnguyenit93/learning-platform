`ReentrantReadWriteLock` tách quyền truy cập thành:

```text
Read Lock
→ nhiều reader có thể cùng giữ

Write Lock
→ exclusive
```

Quy tắc cơ bản:

| A đang giữ | B muốn | Kết quả |
| --- | --- | --- |
| Read | Read | Có thể cùng chạy |
| Read | Write | Write phải chờ |
| Write | Read | Read phải chờ |
| Write | Write | Write phải chờ |

Tham khảo:

```text
SynchronizationController#readWriteLock()
GET /synchronization/read-write-lock
```

Experiment cho hai reader cùng giữ read lock rồi khởi động writer.

Điểm cần quan sát:

```text
maxConcurrentReaders >= 2
writerAcquiredWhileReadersHeld = false
writerEventuallyAcquired = true
```

### Lock downgrading

`ReentrantReadWriteLock` hỗ trợ **downgrade** từ write lock sang read lock theo flow:

```text
hold write lock
→ acquire read lock
→ release write lock
→ tiếp tục giữ read lock
```

Chiều ngược lại **không được hỗ trợ như một lock upgrade**. Một Thread đang giữ read lock không thể dựa vào việc acquire write lock để "nâng cấp" quyền giữ lock mà vẫn giữ nguyên read lock.

Mental model cần nhớ:

```text
write → read
→ supported downgrade

read → write
→ upgrade không được support
→ phải thiết kế lại flow, release read lock rồi cạnh tranh write lock theo protocol phù hợp
```

Tham khảo experiment riêng:

```text
SynchronizationController#readWriteLockDowngrade()
GET /synchronization/read-write-lock-downgrade
```

Experiment giữ write lock, acquire thêm read lock rồi release write lock. Một writer khác vẫn phải chờ cho tới khi read lock downgrade được release.

Sau đó cùng experiment giữ **chỉ read lock** rồi thử `writeLock().tryLock(timeout)`. Kết quả kỳ vọng:

```text
readToWriteUpgradeSucceeded = false
readToWriteUpgradeSupported = false
```

**Kết luận:** downgrade giữ continuity của quyền đọc sau khi kết thúc mutation; `ReentrantReadWriteLock` không hỗ trợ read → write upgrade. Nếu cần write access, flow phải release/re-coordinate thay vì giữ read lock và chờ nâng cấp.
