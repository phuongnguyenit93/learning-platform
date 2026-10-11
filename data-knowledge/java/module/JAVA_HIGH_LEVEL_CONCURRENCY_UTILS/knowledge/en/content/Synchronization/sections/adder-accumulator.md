`LongAdder` useful for counters with high contention. It scatters updates into multiple cells and then aggregates them by `sum()`.

### Limit when reading the total while still having the writer

`sum()` **Atomic Snapshot is not guaranteed** of the entire counter when other threads are still updating. It should not be interpreted as having only one fixed delay or always paying one snapshot at a single time.

When the concurrent update is no longer available, `sum()` pay the exact sum. So the experiment `atomicTools()` standby `join()` Whole Worker Before Reading Total:

```text
4 workers × 1,000 increments
→ join all workers
→ atomicInteger = longAdder = expectedCount = 4.000
```

Equal results after joining do not prove `LongAdder` replaces all use cases of `AtomicLong`.
Use an adder for statistics/metrics; with a sequence ID or admission type of "only for up to N requests", a suitable atomic state transition or primitive such as Semaphore. Not used `sum() < limit` then `increment()` like an atomic manipulation.

Refer to the contract: [LongAdder.sum() — Java 21](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/LongAdder.html#sum()).

### LongAccumulator

`LongAccumulator` Generalize the idea with an accumulator function.

The accumulator function should be consistent with how the intermediate result is combined. Operations such as `Sum`, `max`, `Min` is an easy reasoning example.

It is not recommended to use a sequence-dependent or incombinable operation and then expect the result to be the same as sequential processing.

Also the accumulator function should **side-effect-free**. Implementation may have to reapply the function during the concurrent update/retry process, so it should not be considered a business action "exactly once" each time.

No Style:

```java
(current, value) -> {
    sendEmail();
    auditLog();
    return Math.max(current, value);
}
```

The side effect must be outside the reduction function; the function should only calculate the result from its arguments.

References:

```text
SynchronizationController#atomicTools()
GET /synchronization/atomic-tools
```

Demo Usage:

- `AtomicInteger` for exact counter;
- `LongAdder` for concurrent additions;
- `LongAccumulator` with permission `max`.
