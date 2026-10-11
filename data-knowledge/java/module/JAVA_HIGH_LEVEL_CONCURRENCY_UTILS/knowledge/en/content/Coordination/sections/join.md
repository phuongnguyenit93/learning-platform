`join()` is lifecycle coordination.

```text
Thread A start worker
        ↓
Thread A calls worker.join()
        ↓
Thread A Waiting
        ↓
TERMINATED
        ↓
Thread A continues
```

In addition to waiting for the end, `join()` there is also the happens-before guarantee learned in the JMM section.

References:

```text
CoordinationController#join()
GET /coordination/join
```

**Final Thoughts** `join()` appropriate when the dependency is "I only continue after this thread is completed".
