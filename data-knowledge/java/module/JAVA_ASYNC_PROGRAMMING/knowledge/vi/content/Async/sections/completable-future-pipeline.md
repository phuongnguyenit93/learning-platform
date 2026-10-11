`CompletableFuture` cho phép gắn continuation thay vì buộc caller tự `get()` từng bước.

Các nhóm method quan trọng:

### Transformation

```text
thenApply
thenApplyAsync
```

### Flat composition

```text
thenCompose
thenComposeAsync
```

Dùng khi callback trả về một `CompletionStage` khác và muốn tránh nested future.

### Combine hai nhánh độc lập

```text
thenCombine
thenCombineAsync
```

### Side effect

```text
thenAccept
thenRun
```

Tham khảo:

```text
AsyncController#pipeline()
GET /async/pipeline
```

Pipeline demo:

```text
order task ───────────┐
                     ├─ thenCombine → total
exchange-rate task ──┘
                           ↓
                       thenApply
```

Hai nhánh đầu dùng custom executor cục bộ; executor được shutdown bằng completion callback.

### get() và join() khác nhau ở exception model

Cả `get()` và `join()` đều có thể chờ completion, nhưng API surface khác nhau:

```text
get()
→ checked InterruptedException
→ checked ExecutionException khi computation fail

join()
→ không khai báo checked exception
→ exceptional completion được expose qua CompletionException
→ cancelled future có thể ném CancellationException
```

`join()` không có nghĩa non-blocking. Nếu stage chưa complete, caller vẫn có thể phải chờ.

Trong experiment `allOf()`, code gọi `all.get(...)` với timeout để bounded wait toàn bộ barrier trước, sau đó dùng `join()` trên từng future đã completed để lấy typed result. Đây là lựa chọn API, không phải hai cơ chế execution khác nhau.
