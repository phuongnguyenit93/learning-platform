Java threads have daemon attributes.

The most important point is not that the daemon "runs in the background", but how the JVM decides when it ends.

### User threads and daemon threads

The JVM continues to exist as long as the user thread is alive.

When there are no user threads alive, the JVM can terminate even though the thread daemon has not yet completed.

```text
User Thread is alive
    → JVM keeps running

Only Daemon Thread Left
    → JVM is not required to wait for the daemon to complete
```

Therefore, daemon threads are not suitable for tasks that must be completed before the process is finished, such as recording important data without other assurance mechanisms.

Daemon also **does not mean low priority**. `Daemon` is a property related to JVM liveness/lifecycle; thread scheduling priority is another concept. It is not inferred that a thread daemon will automatically be given lower priority by the CPU just because `isDaemon() == true`.

### New thread inherits daemon status

When creating a new thread, the default status daemon is inherited from the thread that created it.

Can be changed before start:

```java
Thread worker = new Thread(task);
worker.setDaemon(true);
worker.start();
```

After the Thread has been started, the daemon flag cannot be changed with `setDaemon(...)`.

### Why not use HTTP endpoints to prove JVM exit?

In Spring Boot, the end of an HTTP request does not mean the end of the JVM.

The server still has many other user threads alive.

Hence the demo type:

```text
Request End
→ conclusion Daemon Thread must die
```

is wrong.

Controllers are only suitable for observing daemon properties, not for proving JVM shutdown rules.

### Demo in Spring Boot

Refer to the controller:

```text
DaemonThreadController#inspectDaemonRules()
```

Endpoint:

```text
GET /daemon/inspect
```

The demo shows:

- the status of the HTTP request thread;
- the status daemon that the Child Thread inherits by default;
- value after actively calling `setDaemon(true)` Previous `start()`.

When running this endpoint, there is no conclusion about when the JVM shutdown. Endpoints are for observational purposes only **Daemon Flag and Inheritance Rule**.

### Standalone JVM lifecycle demo

File:

```text
src/main/java/com/example/learning/module/basic/thread/DaemonJvmExitDemo.java
```

This class has `main()` and must run as a standalone Java application.

Runs with:

```text
True → Worker is Daemon Thread
false → worker is user thread
```

When `true`, `Main` end before the worker and the JVM does not wait for the worker to finish.

When `false`, the worker is the user thread, so the JVM continues to live until the worker is finished.

**Final Thoughts** HTTP demo helps to observe the daemon property; `DaemonJvmExitDemo.main()` is the right experiment to prove JVM exit semantics.
