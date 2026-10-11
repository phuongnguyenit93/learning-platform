```text
Simple State/Counter
→ Atomic / LongAdder

Multi-step critical section
→ synchronized or Lock

Read-Heavy Shared Structure
→ consider ReadWriteLock/CopyOnWrite depending on the pattern

Sorted Concurrent Map
→ ConcurrentSkipListMap

Conventional Concurrent Map
→ ConcurrentHashMap

Optimistic Read
→ StampedLock if complexity is worth it
```

Don't choose a tool based solely on "this is faster". Correctness first, then measure the actual contention/workload.
