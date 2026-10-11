Ba API này có vai trò khác nhau.

| API | Loại | Kiểm tra Thread nào? | Có clear flag không? |
| --- | --- | --- | --- |
| `thread.interrupt()` | instance | target thread | gửi interruption request |
| `thread.isInterrupted()` | instance | thread được gọi | Không |
| `Thread.interrupted()` | static | current thread | Có |

Điểm dễ nhầm nhất là `Thread.interrupted()`.

Ví dụ worker đã có interrupt status = `true`:

```java
Thread.currentThread().isInterrupted();
// true

Thread.currentThread().isInterrupted();
// vẫn true

Thread.interrupted();
// trả true và clear status

Thread.interrupted();
// false
```

Mental model:

```text
isInterrupted()
→ observe
→ không consume signal

Thread.interrupted()
→ observe current thread
→ consume/clear signal
```

Không nên clear interrupt status một cách tùy tiện. Việc clear tín hiệu có thể khiến code ở tầng trên không còn biết cancellation đã được yêu cầu.

### Demo trong module

Tham khảo:

```text
InterruptionController#inspectInterruptFlag()
```

Endpoint:

```text
GET /interruption/flag
```

Worker được interrupt trong lúc đang spin, sau đó lần lượt gọi:

```text
isInterrupted()
isInterrupted()
Thread.interrupted()
Thread.interrupted()
isInterrupted()
```

Kết quả cần quan sát:

```text
true
true
true
false
false
```

**Kết luận:** `isInterrupted()` chỉ đọc flag; `Thread.interrupted()` đọc rồi clear interrupt status của current thread.
