This is the most basic knowledge when working directly with `Thread`.

Suppose there is:

```java
Thread worker = new Thread(task, "worker-thread");
```

### Call run()

```java
worker.run();
```

This is just a regular Java method call.

No new threads are started.

`task` Run right on the incoming thread `run()`.

```text
HTTP request thread
      ↓
worker.run()
      ↓
the task still runs on the HTTP request thread
```

### Call start()

```java
worker.start();
```

`start()` ask the JVM to start the execution of that Thread. The JVM will then call the `run()` on the new thread.

```text
HTTP request thread
      │
      └── worker.start()
              ↓
        worker-thread
              ↓
            run()
```

So:

```text
run() → normal method call
start() → start the lifecycle of a new thread
```

An object `Thread` can only `start()` once. If calling `start()` the second time after it has been started, the JVM throws `IllegalThreadStateException`.

### Demo in module

Refer to the controller:

```text
BasicThreadController#startVsRun()
```

Endpoint:

```text
GET /basic/start-vs-run
```

Demo runs the same `Runnable` in two ways:

1. Direct Call `run()`;
2. create Threads and call `start()`.

When running, compare the thread names:

```text
run() directly
→ task running on caller/request thread

start()
→ task running on basic-start-worker
```

The point to observe is not the log order, but the **Which thread is executing `run()`**.

**Final Thoughts** Call `run()` just call the normal method; call `start()` just start the lifecycle of a separate Thread.
