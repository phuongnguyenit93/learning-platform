`ReentrantReadWriteLock` default is **non-fair**; A Fair Lock can be created by:

```java
new ReentrantReadWriteLock(true);
```

Fairness doesn't mean `Thread.start()` First definitely acquire first. It involves a policy serving the threads that are competing for locks, and in return there is often a throughput cost.

Similar `ReentrantLock`, non-blocking `tryLock()` of `ReadLock`/`WriteLock` It should not be used as proof that fair mode is always honored in all acquisition APIs. They can be acquired immediately if the lock state allows it, regardless of the waiter in line. If fairness is a protocol requirement, the acquisition API with the appropriate semantics must be chosen instead of relying solely on the constructor `new ReentrantReadWriteLock(true)`.

With read-heavy workloads, a non-fair policy can give good throughput, but writers may have to wait a long time if the reader keeps appearing. So don't choose `ReadWriteLock` just because I heard that "multiple readers run in parallel".

It's worth considering when:

- read more than write significantly;
- The critical section reads large enough for the concurrency to be beneficial;
- contention does exist;
- Benchmark/Workload shows greater benefits over overhead management of two types of locks.

References:

```text
SynchronizationController#readWriteLockPolicy()
GET /synchronization/read-write-lock-policy
```

The Experiment does not attempt to prove fairness by the log order. It directly observes the configured policy:

```text
defaultIsFair = false
explicitFairIsFair = true
untimedReadTryLockHonorsFairness = false
untimedWriteTryLockHonorsFairness = false
fairnessGuaranteesThreadStartOrder = false
```

**Final Thoughts** Fairness is a policy, not a benchmark shortcut; starvation/throughput must be evaluated according to the actual workload.
