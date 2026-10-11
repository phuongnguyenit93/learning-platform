Deadlock kinh điển cần đồng thời bốn điều kiện thường gọi là **Coffman conditions**:

1. **Mutual exclusion**: resource chỉ có một owner tại một thời điểm.
2. **Hold and wait**: Thread giữ resource này trong khi chờ resource khác.
3. **No preemption**: resource không bị cưỡng bức lấy khỏi owner hiện tại.
4. **Circular wait**: tồn tại vòng chờ A → B → ... → A.

Không phải lúc nào cũng có thể loại bỏ ba điều kiện đầu. Một chiến lược thực dụng là phá **circular wait** bằng **global lock ordering**.

Ví dụ, nếu toàn application thống nhất:

```text
mọi nơi cần cả Lock A và Lock B
→ luôn acquire A trước
→ rồi mới acquire B
```

thì không được viết một code path khác acquire `B → A`.

Tham khảo:

```text
ConcurrencyProblemController#deadlockPrevention()
GET /concurrency/problem/deadlock-prevention
```

Experiment cho hai worker cạnh tranh cùng hai lock nhưng cả hai đều dùng thứ tự:

```text
A → B
```

Kết quả kỳ vọng:

```text
completedWorkers = 2
circularWaitPossibleByDesign = false
workersTerminated = true
```

**Kết luận:** `tryLock(timeout)` là một cách thoát khỏi wait nguy hiểm; **consistent lock ordering** là một cách thiết kế để loại bỏ circular-wait dependency ngay từ đầu.
