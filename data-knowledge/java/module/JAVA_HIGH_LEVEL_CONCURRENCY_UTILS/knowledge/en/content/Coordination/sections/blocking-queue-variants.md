Not every `BlockingQueue` only different implementation detail.

| Queue | Capacity / ordering | Points to remember |
| --- | --- | --- |
| `ArrayBlockingQueue` | bounded, array-backed | fixed capacity; constructor with fairness option |
| `LinkedBlockingQueue` | bounded if transmission capacity; default capacity is very large | suitable for FIFO backlog but still need to actively limit in production |
| `SynchronousQueue` | do not save elements | direct handoff between producer and consumer |
| `PriorityBlockingQueue` | priority-ordered, effectively unbounded | priority by comparator/natural order, not regular FIFO |

`PriorityBlockingQueue` does not provide backpressure by capacity as `ArrayBlockingQueue`. If producers are faster than consumers, the backlog can still increase.

Also, if two elements have the same priority, FIFO should not be relied upon as a default contract. If the business needs stable ordering, the comparator/data model must encode an explicit tie-breaker, e.g. sequence number.

`drainTo(...)` useful when it is necessary to remove a batch of elements from `BlockingQueue` without repetition `poll()` each item.

References:

```text
CoordinationController#blockingQueueVariants()
GET /coordination/blocking-queue-variants
```

Experiment shows:

```text
ArrayBlockingQueue full → offer() pays false
LinkedBlockingQueue → drainTo get finite batch
PriorityBlockingQueue → otp before delivery before promotion by priority
```

**Final Thoughts** Select queues based on capacity, ordering, and handoff semantics; do not select based on general benchmarks alone.
