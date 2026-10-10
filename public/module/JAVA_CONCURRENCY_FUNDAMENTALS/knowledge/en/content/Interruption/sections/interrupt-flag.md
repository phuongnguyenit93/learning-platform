These three APIs have different roles.

| API | Type | Which Thread to check? | Is there a clear flag? |
| --- | --- | --- | --- |
| `thread.interrupt()` | instance | target thread | send interruption request |
| `thread.isInterrupted()` | instance | thread called | No |
| `Thread.interrupted()` | static | current thread | Yes |

The easiest point to be mistaken for is `Thread.interrupted()`.

Example worker has interrupt status = `true`:

```java
Thread.currentThread().isInterrupted();
true

Thread.currentThread().isInterrupted();
Still true

Thread.interrupted();
Pay true and clear status

Thread.interrupted();
false
```

Mental model:

```text
isInterrupted()
→ observe
→ don't consume signals

Thread.interrupted()
→ observe current thread
→ consume/clear signal
```

Do not clear the interrupt status arbitrarily. Clearing the signal may cause the code on the upper floor to no longer know that the cancellation has been requested.

### Demo in module

References:

```text
InterruptionController#inspectInterruptFlag()
```

Endpoint:

```text
GET /interruption/flag
```

The worker is interrupted while spinning, then takes turns calling:

```text
isInterrupted()
isInterrupted()
Thread.interrupted()
Thread.interrupted()
isInterrupted()
```

Results to observe:

```text
true
true
true
false
false
```

**Final Thoughts** `isInterrupted()` only reads flags; `Thread.interrupted()` Read the Clear Interrupt status of the current thread.
