`LockSupport.park()` pause Threads and `unpark(thread)` grant permission to Thread by name.

Useful differences from `notify()`:

- no need to keep the intrinsic monitor;
- `unpark` accurate Thread designation;
- Permit can be issued before Thread calls `park()`.

Permit of `LockSupport` not an infinitely cumulative counter. Mental model is close to a "permitted/unpermitted" state: many times `unpark(thread)` before once `park()` do not accumulate into many parks in the future all pass by themselves.

`park()` There are also other interruption semantics APIs such as `sleep()`/`wait()`:

```text
park()
→ can return because of permit/unpark
→ can return because the Thread is interrupted
→ can spurious return

park()
→ does not throw an InterruptedException
→ caller must self-check the predicate and/or interrupt status
```

So the actual pattern is still a loop around the condition/cancellation state, not a call `park()` once and then default that the cause of the return is definitely `unpark()`.

Another important detail: permit can be granted **after the Thread has started but before the `park()` corresponding**. Don't expand that sentence to guarantee that call `unpark(thread)` on a Thread **Not started yet** will save the permit for future runs.

When building lower primitives/frameworks, overload `park(blocker)` useful for diagnostics. JVM can expose blocker objects via `LockSupport.getBlocker(thread)`, which helps thread dump/debugging indicate which abstraction Thread is parking instead of just seeing a vague park point.

References:

```text
CoordinationController#lockSupport()
GET /coordination/lock-support
```

Demo park three workers. The first two workers use a predicate loop to prove targeted `unpark`; The third worker was interrupted during park to observe interruption semantics. Main results:

```text
targetedWorkerResumed = true
otherWorkerStillParked = true
parkReturnedWhenInterrupted = true
interruptStatusObservedAfterPark = true
parkThrowsInterruptedException = false
blockerVisibleWhileParked = true
```

Then experiment `unpark(first)` and cleanup all workers before returning.

This directly proves that `unpark(thread)` target a specific thread, and interrupting is another reason to do `park()` return. Permit pre-issue (`unpark` post-start but before `Park`) are still valid semantics of `LockSupport`, but not as the sole evidence because `park()` Also allows for Spurious Return.
