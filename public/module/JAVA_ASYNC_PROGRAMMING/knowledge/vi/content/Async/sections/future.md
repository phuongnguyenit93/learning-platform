`Callable<T>` mô tả task có result/exception.

```java
Future<String> future = executor.submit(callable);
```

`Future` cho phép:

- kiểm tra `isDone()`;
- `cancel(...)`;
- lấy result bằng `get()`;
- `get(timeout, unit)`.

Điểm giới hạn: `future.get()` là blocking wait của caller.

Tham khảo:

```text
AsyncController#future()
GET /async/future
```

Demo giữ task chưa hoàn thành, xác nhận `isDone=false`, sau đó cho task chạy xong và gọi `get()`.

**Kết luận:** `Future` tách submit khỏi result retrieval, nhưng chỗ gọi `get()` vẫn có thể block.

### <a id="future-cancellation">Future cancellation và mayInterruptIfRunning</a>

`Future.cancel(...)` thay đổi completion state của Future thành cancelled nếu cancellation được chấp nhận. Tham số:

```java
future.cancel(false);
future.cancel(true);
```

không nên hiểu thành:

```text
false = task chắc chắn dừng nhẹ nhàng
true  = JVM kill task ngay lập tức
```

Mental model đúng hơn:

```text
cancel(false)
→ không yêu cầu interrupt task đang chạy
→ task đã chạy có thể tiếp tục tới completion tự nhiên

cancel(true)
→ implementation có thể interrupt Thread đang chạy task
→ task vẫn phải cooperate với interruption
```

Sau khi Future đã cancelled, `get()` không trả result của task mà ném `CancellationException`, kể cả trường hợp underlying code với `cancel(false)` vẫn tiếp tục chạy đến hết.

Tham khảo:

```text
AsyncController#futureCancellation()
GET /async/future-cancellation
```

Experiment chạy hai task đang block ở `CountDownLatch`:

```text
cancel(false)
→ Future cancelled
→ worker không bị interrupt
→ task vẫn block cho tới khi experiment chủ động release

cancel(true)
→ Future cancelled
→ worker đang await nhận InterruptedException
→ task kết thúc qua cancellation path
```

Điều này nối trực tiếp với chapter Interruption:

```text
Future cancellation
→ có thể request interruption
→ interruption vẫn là cooperative protocol
```
