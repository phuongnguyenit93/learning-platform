Atomicity/visibility/ordering chủ yếu nói về **correctness của state**.

Deadlock/livelock/starvation nói về **progress của hệ thống**.

### Deadlock

Deadlock xảy ra khi các Thread tạo thành dependency cycle và không Thread nào có thể tiếp tục.

Kịch bản kinh điển:

```text
Thread A giữ Lock A
Thread A đợi Lock B

Thread B giữ Lock B
Thread B đợi Lock A
```

Đây là circular wait.

Một deadlock thật nếu tạo trực tiếp trong HTTP demo sẽ để lại Thread bị kẹt lâu dài, nên module không tạo intentional permanent deadlock.

Thay vào đó dùng experiment bounded mô phỏng đúng hình dạng dependency rồi dùng `tryLock()` để thoát.

Tham khảo:

```text
ConcurrencyProblemController#deadlockRisk()
```

Endpoint:

```text
GET /concurrency/problem/deadlock-risk
```

Kết quả kỳ vọng:

```text
threadAHasFirstLock = true
threadBHasFirstLock = true
threadASecondLockAcquired = false
threadBSecondLockAcquired = false
recoveredWithoutLeak = true
```

**Kết luận:** endpoint này chứng minh circular-lock dependency và deadlock avoidance, không giả vờ rằng timeout chính là deadlock.

### Livelock

Livelock xảy ra khi các Thread vẫn chạy và liên tục phản ứng với nhau nhưng không tạo được progress.

Ví dụ mental model:

```text
A thấy B đang thử
→ A lùi lại

B thấy A đang thử
→ B lùi lại

cả hai thử lại cùng lúc
→ lặp lại
```

Tham khảo:

```text
ConcurrencyProblemController#boundedLivelock()
```

Endpoint:

```text
GET /concurrency/problem/livelock
```

Demo cố tình giữ hai worker phản ứng đối xứng trong số vòng hữu hạn rồi kết thúc.

Kết quả kỳ vọng:

```text
progressMade = false
workerABackoffs > 0
workerBBackoffs > 0
workersTerminated = true
```

Nó minh họa **active but no progress** mà không để lại infinite loop.

### Starvation

Starvation xảy ra khi một Thread có thể tiếp tục về lý thuyết nhưng trong thực tế liên tục không nhận được CPU/lock/resource cần thiết trong thời gian rất dài.

Khác biệt nhanh:

| Problem | Thread có hoạt động? | System có progress? |
| --- | --- | --- |
| Deadlock | Không thể tiến tiếp | Không |
| Livelock | Có, phản ứng liên tục | Không |
| Starvation | Một số Thread khác vẫn tiến | Một Thread có thể bị bỏ đói |

Starvation phụ thuộc scheduler/lock policy và workload, nên không nên dùng vài dòng `println` để "chứng minh" nó. Fair/unfair lock sẽ được học kỹ ở phần Synchronization.
