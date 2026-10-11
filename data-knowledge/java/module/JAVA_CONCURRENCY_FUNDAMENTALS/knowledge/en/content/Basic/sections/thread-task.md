This is a very easy point to learn wrong if you only remember individual APIs.

### Thread

`Thread` represents an execution flow.

For example:

```java
Thread worker = new Thread(() -> {
    System.out.println(Thread.currentThread().getName());
});

worker.start();
```

### Runnable

`Runnable` Job Description:

```java
Runnable task = () -> {
    System.out.println("Doing work");
};
```

`Runnable` is not a Thread and does not create a new thread by itself.

Want a task to run on a new Thread:

```java
Thread worker = new Thread(task);
worker.start();
```

Mental model:

```text
Runnable
   = WHAT to run

Thread
   = WHERE execution happens
```

### Callable

`Callable<V>` also describes a task but can:

- returns results;
- throw checked exception.

```java
Callable<String> task = () -> "result";
```

`Callable` nor do they create their own Threads.

In the Basic section, the module uses `FutureTask` to connect `Callable` with a Direct Thread:

```java
Callable<String> task = () -> "result";
FutureTask<String> futureTask = new FutureTask<>(task);

Thread worker = new Thread(futureTask, "callable-worker");
worker.start();

String result = futureTask.get();
```

`Future`, `ExecutorService` and `CompletableFuture` will be studied carefully in the following chapters.

### Executor

An executor is an abstraction used to receive a task and decide how the task is executed.

In the Basic section, just keep in mind:

```text
Task abstraction
    Runnable/Callable
            ↓
Execution mechanism
    Thread/Executor
```

Don't call `Callable` or Thread Pools are "how to create Threads" because they take on different roles.

### Contact the code in the module

References:

```text
CreateThreadController#createByExtends()
CreateThreadController#createByRunnable()
CreateThreadController#createByCallable()
```

These three methods are placed side by side to clearly see three different roles:

```text
MyWorker extends Thread
    → task and execution mechanism are attached to the same class

Runnable + Thread
    → task and Thread are separated

Callable + FutureTask + Thread
    → resulting task still needs an execution mechanism to run
```

**Final Thoughts** `Runnable` and `Callable` Description **Jobs**; `Thread` or `Executor` Take responsibility **Job execution**.
