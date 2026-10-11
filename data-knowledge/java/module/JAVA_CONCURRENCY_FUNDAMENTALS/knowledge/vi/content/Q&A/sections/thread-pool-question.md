Không theo contract của `execute()`.

Flow:

```text
core
→ queue
→ max workers
→ rejection
```

Backpressure phải đến từ policy/architecture cụ thể, ví dụ `CallerRunsPolicy`, bounded admission control hoặc upstream rate limiting.

### execute() và submit() có giống nhau về failure observation không?

Không.

```text
execute(Runnable)
→ void
→ uncaught failure đi theo worker uncaught-exception path

submit(Runnable/Callable)
→ Future
→ result/failure được giữ trong Future
→ get() expose failure qua ExecutionException
```

Submit rồi bỏ luôn `Future` có thể làm application mất một failure-observation channel quan trọng.
