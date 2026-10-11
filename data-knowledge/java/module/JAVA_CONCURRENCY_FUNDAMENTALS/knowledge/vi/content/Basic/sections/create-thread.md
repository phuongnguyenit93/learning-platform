Trong phần Basic, mục tiêu là hiểu API mức thấp trước khi học Executor.

### Cách 1: extends Thread

```java
public class MyWorker extends Thread {

    public MyWorker(String name) {
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

Sử dụng:

```java
Thread worker = new MyWorker("extends-thread-worker");
worker.start();
```

Cách này giúp nhìn rõ quan hệ kế thừa với `Thread`, nhưng nó làm class công việc bị gắn chặt với execution mechanism.

### Cách 2: Runnable + Thread

```java
Runnable task = () -> {
    System.out.println(
            "Running on " + Thread.currentThread().getName()
    );
};

Thread worker = new Thread(task, "runnable-worker");
worker.start();
```

Cách này tách rõ:

```text
Runnable = task
Thread   = execution
```

Đây là mental model quan trọng để sau này hiểu Executor.

### Callable + FutureTask + Thread

`Callable` không thể truyền trực tiếp vào constructor `Thread` vì `Thread` nhận `Runnable`.

`FutureTask` có thể bọc `Callable` và đồng thời implements `Runnable`:

```java
Callable<String> task = () -> "Kết quả";
FutureTask<String> futureTask = new FutureTask<>(task);

Thread worker = new Thread(futureTask, "callable-worker");
worker.start();

String result = futureTask.get();
```

Điểm cần hiểu:

```text
Callable
    ↓ được bọc bởi
FutureTask
    ↓ được chạy bởi
Thread
```

### Demo trong module

Tham khảo controller:

```text
CreateThreadController#createByExtends()
CreateThreadController#createByRunnable()
CreateThreadController#createByCallable()
```

Các endpoint:

```text
GET /create/extends
GET /create/runnable
GET /create/callable
```

Khi chạy từng endpoint, hãy quan sát tên worker trong response:

```text
/extends
→ extends-thread-worker

/runnable
→ runnable-thread-worker

/callable
→ callable-thread-worker
```

`/extends` và `/runnable` đều tạo execution bằng `Thread`, nhưng cách tổ chức task khác nhau. `/callable` cho thấy `Callable` không tự chạy: nó được `FutureTask` bọc lại rồi mới được một `Thread` thực thi.

Mỗi demo đều `join()` hoặc chờ kết quả trước khi kết thúc experiment, nên không để lại worker thread ngoài ý muốn.

**Kết luận:** phần này học cách nối **task** với **execution mechanism**, không phải học ba API tương đương nhau.
