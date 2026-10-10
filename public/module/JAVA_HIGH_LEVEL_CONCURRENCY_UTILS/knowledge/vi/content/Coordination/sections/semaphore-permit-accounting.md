Tham khảo:

```text
CoordinationController#semaphorePermitAccounting()
GET /coordination/semaphore-permit-accounting
```

Experiment bắt đầu với một permit rồi cố tình gọi `release()` mà chưa acquire:

```text
initialPermits = 1
permitsAfterUnmatchedRelease = 2
semaphoreEnforcesOwner = false
```

Sau over-release, code thậm chí có thể acquire hai permit cùng lúc dù resource ban đầu chỉ có capacity 1.

**Kết luận:** với Semaphore, permit accounting là trách nhiệm của application. Pattern `boolean acquired` + `finally` giúp tránh release khi acquisition thất bại/interrupted.
