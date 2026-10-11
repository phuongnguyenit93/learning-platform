Java defines six states in `Thread.State`:

```text
NEW
RUNNABLE
BLOCKED
WAITING
TIMED_WAITING
TERMINATED
```

No enum state named `RUNNING`.

A thread that is actually using the CPU is still represented by the JVM `RUNNABLE`.

### NEW

Thread object has been created but has not yet `start()`:

```java
Thread worker = new Thread(task);
System.out.println(worker.getState()); NEW
```

### RUNNABLE

The thread has been started and is either executable or executable.

Java doesn't separate "ready" and "running" into two values `Thread.State`.

### BLOCKED

Thread waiting for the intrinsic monitor to enter a block or method `synchronized`.

For example:

```text
Thread A holds monitor X
        ↓
Thread B tries to synchronize(X)
        ↓
Thread B = BLOCKED
```

`BLOCKED` has a very specific meaning: wait for the monitor lock of `synchronized`.

Every case should not be called "waiting" `BLOCKED`.

### WAITING

Threads are waiting indefinitely until another condition or event makes it possible to continue.

Some APIs can include threads `WAITING`:

- `Object.wait()` no timeout;
- `Thread.join()` no timeout;
- `LockSupport.park()`.

Example with `wait()`:

```java
synchronized (monitor) {
    monitor.wait();
}
```

Thread is calling `wait()` must be awakened by `notify()`, `notifyAll()`, interrupt, or a mechanism that matches the API being used.

Private `join()` There are other semantics: the thread is calling `join()` Wait for the target thread to finish.

### TIMED_WAITING

Thread is waiting with a time limit.

For example:

- `Thread.sleep(...)`;
- `Object.wait(timeout)`;
- `Thread.join(timeout)`;
- `LockSupport.parkNanos(...)`.

### TERMINATED

Method `run()` completed or terminated by exception not processed.

The thread object still exists as a Java object, but the execution of that thread has ended and cannot be `start()` again.

### Mental model diagram

```text
new Thread(...)
      ↓
     NEW
      ↓ start()
   RUNNABLE
      ↓
 ┌────┼───────────────┐
 ↓    ↓               ↓
BLOCKED WAITING / TIMED_WAITING
 └────┴──────┬────────┘
             ↓
          RUNNABLE
             ↓ run() ends
         TERMINATED
```

This is the conceptual model. A thread can be switched between `RUNNABLE` and multiple standby states throughout the lifecycle.

### Demo in module

Refer to the controller:

```text
BasicThreadController#threadLifeCycle()
```

Endpoint:

```text
GET /basic/thread-life-cycle
```

The new demo actively controls a worker to pass through one after another:

```text
NEW
→ RUNNABLE
→ TIMED_WAITING
→ BLOCKED
→ WAITING
→ TERMINATED
```

The service uses internal signals to observe the state instead of relying solely on intervals. `sleep()` random of the request thread. Separate `TIMED_WAITING` created with a latch with a long timeout; the caller observes the state and then actively releases the latch so that the worker continues to move on `BLOCKED`. So the demo doesn't depend on the scheduler having to "catch up" with a short sleep window.

When running an endpoint, the response should represent enough strings:

```text
NEW -> NEW
RUNNABLE -> RUNNABLE
TIMED_WAITING -> TIMED_WAITING
BLOCKED -> BLOCKED
WAITING -> WAITING
TERMINATED -> TERMINATED
```

The point to observe is that each state appears because **a specific cause**:

- `TIMED_WAITING` due to waiting for a timeout;
- `BLOCKED` due to waiting for the intrinsic monitor of `synchronized`;
- `WAITING` Red `wait()` no timeout;
- `TERMINATED` after `run()` end.

**Final Thoughts** Every state of "waiting" should not be lumped together into a general concept. `Thread.State` describe different types of waits with different semantics.
