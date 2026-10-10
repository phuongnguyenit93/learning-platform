| README section | Controller method | Endpoint | Purpose |
| --- | --- | --- | --- |
| `#shared-state-race-condition` | `ConcurrencyProblemController#raceCondition()` | `GET /concurrency/problem/race-condition` | Create a deterministic lost update |
| `#happens-before` | `ConcurrencyProblemController#startJoinHappensBefore()` | `GET /concurrency/problem/happens-before-start-join` | Observe the start/join memory guarantee |
| `#volatile-publication` | `ConcurrencyProblemController#volatilePublication()` | `GET /concurrency/problem/volatile-publication` | Publish plain data via volatile flag |
| `#volatile-publication` | `ConcurrencyProblemController#volatileIsNotAtomic()` | `GET /concurrency/problem/volatile-not-atomic` | Proving volatile doesn't do compound update atomic |
| `#progress-problems` | `ConcurrencyProblemController#deadlockRisk()` | `GET /concurrency/problem/deadlock-risk` | Observing circular lock dependency but cleanup is possible |
| `#deadlock-prevention` | `ConcurrencyProblemController#deadlockPrevention()` | `GET /concurrency/problem/deadlock-prevention` | Break the Circular Wait with Global Lock Ordering |
| `#progress-problems` | `ConcurrencyProblemController#boundedLivelock()` | `GET /concurrency/problem/livelock` | Illustrating active-without-progress in a bounded way |

After this part, you need to be able to answer yourself:

1. Why `count++` Can it take an update?
2. Why doesn't race condition mean "it's wrong every time you run"?
3. What problem does JMM solve?
4. How is Happens-before different from chronological order?
5. `Volatile` What is guaranteed and what is not guaranteed?
6. Why shouldn't volatile be explained by "read/write RAM directly"?
7. Why does a stress test that doesn't catch reordering prove the code is correct?
8. What is the difference between deadlock, livelock, and starvation?
9. What are the four Coffman conditions and what does global lock ordering break?
10. How is safe publication different from just "new object finished"?
11. `FINAL` What Guarantees Does Field Offer, and Why `this` Escape in Constructor is design dangerous?
