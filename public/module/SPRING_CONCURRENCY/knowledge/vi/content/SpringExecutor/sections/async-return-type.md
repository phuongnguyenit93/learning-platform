Các kiểu thường gặp:

- `void` cho fire-and-forget;
- `Future<T>`;
- `CompletableFuture<T>`.

Với `void`, caller không có completion handle trực tiếp; exception handling cũng cần được thiết kế riêng.

Trong proxy-based `@Async`, exception của `void` method không thể được caller nhận qua `Future`. Nếu application dùng fire-and-forget thật sự, cần có `AsyncUncaughtExceptionHandler`/logging/metric strategy tương ứng thay vì giả định exception sẽ tự quay lại HTTP caller.

Với `CompletableFuture`, caller có thể compose result theo các concept đã học ở phần Async.

Code hiện dùng result-bearing method:

```text
TaskExecutorService#runAsync(...)
```

để caller có completion handle rõ ràng và experiment có thể quan sát deterministic.

### Demo exception của @Async void

Với `void`, Spring proxy không thể trả exception cho caller thông qua `Future` vì caller không nhận completion handle nào cả.

Cấu hình một `AsyncUncaughtExceptionHandler` riêng:

```text
AsyncExceptionProbe
```

và một async method cố tình fail:

```java
@Async("threadLearningTaskExecutor")
public void failWithoutFuture(String correlationId) {
    throw new IllegalStateException(...);
}
```

Tham khảo:

```text
TaskExecutorController#asyncVoidException()
GET /spring-executor/void-exception
```

Controller dùng một correlation id chỉ để learning experiment có thể quan sát deterministic rằng handler đã nhận đúng failure. Response kỳ vọng có dạng:

```text
handlerInvoked = true
method = failWithoutFuture
exceptionType = IllegalStateException
correlationId = ...
```

Probe cũng cleanup registration khi observation future hoàn thành exceptional hoặc timeout. Controller gắn timeout **trước khi** gọi async proxy và còn bắt submission failure đồng bộ. Điểm này quan trọng vì task có thể bị reject ngay tại submission boundary, trước khi `@Async` method thật sự chạy và trước khi `AsyncUncaughtExceptionHandler` có cơ hội nhận exception từ method body.

Flow của experiment là:

```text
register observation future
→ attach timeout
→ gọi @Async proxy
   ├─ submit thành công → worker chạy → handler complete future
   └─ submit bị reject  → caller nhận submission failure đồng bộ
                       → complete future exceptionally
→ mọi terminal path đều cleanup pending registration
```

Vì vậy cần phân biệt **failure của task sau khi đã dispatch** với **failure ngay tại submission/admission**. `AsyncUncaughtExceptionHandler` giải quyết exception thoát khỏi `void @Async` method body; nó không phải replacement cho rejection handling ở submission boundary.

**Kết luận:** `@Async void` là fire-and-forget đối với caller; error reporting phải đi qua logging/metrics/`AsyncUncaughtExceptionHandler` hoặc một channel riêng. Nếu business flow cần biết success/failure, ưu tiên return `CompletableFuture`/result handle thay vì `void`.
