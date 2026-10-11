Not only that.

Happens-before is a relation of the Java Memory Model with visibility/ordering guarantee.

Important edges learned:

- program order;
- monitor unlock → later lock;
- volatile write → subsequent volatile read;
- `Thread.start()`;
- Successful `Thread.join()`;
- submission to `Executor` → task execution;
- Asynchronous computation → code after successful `Future.get()`;
- release/acquire edge of synchronizers such as latch/semaphore/lock;
- transitivity.

### What does safe publication and final field have to do with happens-before/JMM?

The `new` then an object that does not answer the question by itself that the other thread receives the reference through which memory-consistency boundary. Publication should go through a mechanism with a clear contract such as volatile, lock/monitor, concurrent collection, etc. `Thread.start()`, executor submission or boundary equivalent.

`FINAL` field has a special initialization-safety in JMM if the object is construct correctly and `this` Don't escape before the constructor is complete. That makes immutable objects with final fields easier to reason in concurrent code, but doesn't make mutable fields or mutations that occur after the constructor thread-safe.

Rules to remember:

```text
Complete Construct
→ don't let this escape anytime soon
→ publish via clear boundaries
New → share object between threads
```
