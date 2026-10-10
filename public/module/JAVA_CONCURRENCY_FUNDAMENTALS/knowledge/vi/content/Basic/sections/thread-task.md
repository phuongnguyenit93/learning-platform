Đây là điểm rất dễ học sai nếu chỉ nhớ các API riêng lẻ.

### Thread

`Thread` đại diện cho một luồng thực thi.

Ví dụ:

```java
Thread worker = new Thread(() -> {
    System.out.println(Thread.currentThread().getName());
});

worker.start();
```

### Runnable

`Runnable` mô tả một công việc:

```java
Runnable task = () -> {
    System.out.println("Doing work");
};
```

`Runnable` không phải Thread và tự nó không tạo ra thread mới.

Muốn task chạy trên một Thread mới:

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

`Callable<V>` cũng mô tả một task nhưng có thể:

- trả về kết quả;
- ném checked exception.

```java
Callable<String> task = () -> "result";
```

`Callable` cũng không tự tạo Thread.

Ở phần Basic, module dùng `FutureTask` để kết nối `Callable` với một Thread trực tiếp:

```java
Callable<String> task = () -> "result";
FutureTask<String> futureTask = new FutureTask<>(task);

Thread worker = new Thread(futureTask, "callable-worker");
worker.start();

String result = futureTask.get();
```

`Future`, `ExecutorService` và `CompletableFuture` sẽ được học kỹ ở các chapter sau.

### Executor

Executor là abstraction dùng để nhận task và quyết định cách task được thực thi.

Trong phần Basic chỉ cần ghi nhớ:

```text
Task abstraction
    Runnable / Callable
            ↓
Execution mechanism
    Thread / Executor
```

Không nên gọi `Callable` hoặc Thread Pool là "cách tạo Thread" vì chúng đảm nhận vai trò khác nhau.

### Liên hệ với code trong module

Tham khảo:

```text
CreateThreadController#createByExtends()
CreateThreadController#createByRunnable()
CreateThreadController#createByCallable()
```

Ba method này được đặt cạnh nhau để nhìn rõ ba vai trò khác nhau:

```text
MyWorker extends Thread
    → task và execution mechanism bị gắn vào cùng một class

Runnable + Thread
    → task và Thread được tách rời

Callable + FutureTask + Thread
    → task có kết quả vẫn cần một execution mechanism để chạy
```

**Kết luận:** `Runnable` và `Callable` mô tả **công việc**; `Thread` hoặc `Executor` chịu trách nhiệm **thực thi công việc**.
