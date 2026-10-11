A stable thread count does not mean that the system is safe.

If the producer is faster than the consumer and the queue is not reasonably limited:

```text
arrival rate > service rate
        ↓
Increased backlog
        ↓
queued task hold object/context
        ↓
Memory + Latency Increase
```

This is why the sizing pool must look at the queue, not just the worker count.

References:

```text
LeakController#queuePressure()
GET /leak/queue-pressure
```

The demo uses a small bounded queue, deliberately fills it and then observes rejection; does not create a real unbounded backlog.
