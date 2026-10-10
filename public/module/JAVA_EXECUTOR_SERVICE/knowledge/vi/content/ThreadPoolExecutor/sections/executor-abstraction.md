`Executor` tách việc **submit task** khỏi cách task được thực thi.

```java
executor.execute(task);
```

Caller không cần tự `new Thread(...)` cho từng task.

`ExecutorService` bổ sung lifecycle và result-oriented APIs như:

- `submit()`;
- `shutdown()`;
- `shutdownNow()`;
- `awaitTermination()`.

Điểm quan trọng:

```text
Runnable / Callable = công việc
Executor            = chiến lược thực thi công việc
ThreadPoolExecutor  = một implementation quản lý worker pool
```

### <a id="execute-vs-submit">execute() và submit() khác nhau ở đâu?</a>

Hai API đều có thể đưa `Runnable` vào executor, nhưng completion/result channel khác nhau:

| API | Return | Result/exception observation |
| --- | --- | --- |
| `execute(Runnable)` | `void` | không có `Future`; exception thoát khỏi task đi theo uncaught-exception path của worker |
| `submit(Runnable/Callable)` | `Future<?>` / `Future<T>` | result/exception được giữ trong `Future`; caller quan sát khi `get()` |

Đây là footgun thực tế:

```java
executor.submit(() -> {
    throw new IllegalStateException("boom");
});
```

nếu code bỏ luôn `Future`, exception có thể không xuất hiện theo cách developer kỳ vọng từ `execute()`.

Tham khảo:

```text
ThreadPoolController#executeVsSubmit()
GET /thread-pool/execute-vs-submit
```

Experiment dùng `UncaughtExceptionHandler` riêng để quan sát `execute()` và dùng `Future.get()` để quan sát `submit()`:

```text
execute(task throws)
→ uncaught exception path

submit(task throws)
→ Future complete exceptionally
→ get() ném ExecutionException với cause gốc
```

**Kết luận:** nếu chọn `submit()` cho task quan trọng, phải có strategy quan sát completion/failure thay vì submit rồi bỏ quên handle.
