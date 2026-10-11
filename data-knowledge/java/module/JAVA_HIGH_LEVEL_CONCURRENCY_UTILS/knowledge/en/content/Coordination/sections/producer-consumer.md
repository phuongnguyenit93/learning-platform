Producer–Consumer separates the data creation speed from the data processing speed with an intermediate buffer.

```text
Producer
   ↓ Put
BlockingQueue
   ↓ Take
Consumer
```

With bounded queues, producers can experience backpressure when the buffer is full.

Common method groups:

| Behavior | Insert | Remove |
| --- | --- | --- |
| Exception | `add` | `remove` |
| Special value | `Offer` | `Poll` |
| Block | `Put` | `take` |
| Timed wait | `offer(timeout)` | `poll(timeout)` |

References:

```text
CoordinationController#blockingQueue()
GET /coordination/blocking-queue
```

Demo produce and consume a finite number of items and then join both Threads. Don't let consumers `while(true)` exists after the request.

Operations `put()`, `take()`, `offer(timeout)` and `poll(timeout)` can react to interruption. So the producer/consumer loop still has to preserve cancellation semantics instead of swallowing `InterruptedException`.
