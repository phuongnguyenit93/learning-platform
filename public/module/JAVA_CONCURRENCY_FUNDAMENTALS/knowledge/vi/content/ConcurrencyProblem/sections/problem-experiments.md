| README section | Controller method | Endpoint | Mục đích |
| --- | --- | --- | --- |
| `#shared-state-race-condition` | `ConcurrencyProblemController#raceCondition()` | `GET /concurrency/problem/race-condition` | Tạo lost update deterministic |
| `#happens-before` | `ConcurrencyProblemController#startJoinHappensBefore()` | `GET /concurrency/problem/happens-before-start-join` | Quan sát memory guarantee của start/join |
| `#volatile-publication` | `ConcurrencyProblemController#volatilePublication()` | `GET /concurrency/problem/volatile-publication` | Publish plain data thông qua volatile flag |
| `#volatile-publication` | `ConcurrencyProblemController#volatileIsNotAtomic()` | `GET /concurrency/problem/volatile-not-atomic` | Chứng minh volatile không làm compound update atomic |
| `#progress-problems` | `ConcurrencyProblemController#deadlockRisk()` | `GET /concurrency/problem/deadlock-risk` | Quan sát circular lock dependency nhưng cleanup được |
| `#deadlock-prevention` | `ConcurrencyProblemController#deadlockPrevention()` | `GET /concurrency/problem/deadlock-prevention` | Phá circular wait bằng global lock ordering |
| `#progress-problems` | `ConcurrencyProblemController#boundedLivelock()` | `GET /concurrency/problem/livelock` | Minh họa active-without-progress theo cách bounded |

Sau phần này cần tự trả lời được:

1. Vì sao `count++` có thể mất update?
2. Vì sao race condition không đồng nghĩa "lần nào chạy cũng sai"?
3. JMM giải quyết vấn đề gì?
4. Happens-before khác thứ tự thời gian như thế nào?
5. `volatile` đảm bảo gì và không đảm bảo gì?
6. Vì sao không nên giải thích volatile chỉ bằng "đọc/ghi trực tiếp RAM"?
7. Vì sao một stress test không bắt được reordering không chứng minh code đúng?
8. Deadlock, livelock và starvation khác nhau ở điểm nào?
9. Bốn Coffman conditions là gì và global lock ordering phá điều kiện nào?
10. Safe publication khác gì với việc chỉ "đã new object xong"?
11. `final` field cung cấp guarantee gì, và vì sao `this` escape trong constructor là design nguy hiểm?
