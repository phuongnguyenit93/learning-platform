In the Basic section, the goal is to understand low-level APIs before learning Executor.

### Option 1: extend Thread

```java
public class MyWorker extends Thread {

    publicMyWorker(String name) {
        super(name);
    }

    @Override
    public void run() {
        System.out.println(
                "Running on " + Thread.currentThread().getName()
        );
    }
}
```

Usage:

```java
Thread worker = new MyWorker("extends-thread-worker");
worker.start();
```

This helps to clearly see the inherited relationship with `Thread`, but it makes the work class tied tightly to the execution mechanism.

### Method 2: Runnable + Thread

```java
Runnable task = () -> {
    System.out.println(
            "Running on " + Thread.currentThread().getName()
    );
};

Thread worker = new Thread(task, "runnable-worker");
worker.start();
```

This way clearly separates:

```text
Runnable = task
Thread = execution
```

This is an important mental model for understanding the Executor later.

### Callable + FutureTask + Thread

`Callable` Can't stream directly to Constructor `Thread` because `Thread` GET `Runnable`.

`FutureTask` Wrapable `Callable` and simultaneously implements `Runnable`:

```java
Callable<String> task = () -> "Result";
FutureTask<String> futureTask = new FutureTask<>(task);

Thread worker = new Thread(futureTask, "callable-worker");
worker.start();

String result = futureTask.get();
```

Points to understand:

```text
Callable
    ↓ Wrapped by
FutureTask
    ↓ Run by
Thread
```

### Demo in module

Refer to the controller:

```text
CreateThreadController#createByExtends()
CreateThreadController#createByRunnable()
CreateThreadController#createByCallable()
```

Endpoints:

```text
GET /create/extends
GET /create/runnable
GET /create/callable
```

As you run each endpoint, look at the worker's name in the response:

```text
/extends
→ extends-thread-worker

/runnable
→ runnable-thread-worker

/callable
→ callable-thread-worker
```

`/extends` and `/runnable` all create an execution with `Thread`, but the way the task is organized is different. `/callable` show `Callable` does not run by itself: it is `FutureTask` wrapped up and then got a `Thread` enforcement.

Every demo `join()` or wait for the results before the end of the experiment, so don't leave the worker thread unexpectedly.

**Final Thoughts** This section learns how to join **task** with **Execution Mechanism**, not having to learn three equivalent APIs.
