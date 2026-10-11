`SynchronousQueue` Don't save the element like a regular buffer.

```text
producer put(item)
        ↕ rendezvous
consumer take()
```

Each handoff needs a corresponding opposite side operation.

References:

```text
CoordinationController#synchronousQueue()
GET /coordination/synchronous-queue
```

**Final Thoughts** This is a direct coordination point, not a queue used to store the backlog.
