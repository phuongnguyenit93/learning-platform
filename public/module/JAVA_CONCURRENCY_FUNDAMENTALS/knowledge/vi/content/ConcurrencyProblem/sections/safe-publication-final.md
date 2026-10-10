Việc tạo xong một object ở Thread A không tự động có nghĩa Thread B có thể đọc object đó qua bất kỳ shared reference nào và mặc định nhận đầy đủ mọi guarantee cần thiết.

Điều cần xác định là **reference tới object được publish sang Thread khác bằng boundary nào**.

Một số publication boundary quen thuộc đã xuất hiện trong module:

```text
ghi reference vào volatile field
→ volatile happens-before edge

ghi/đọc dưới cùng monitor hoặc Lock
→ synchronization edge

đặt object vào concurrent collection bằng API có memory-consistency guarantee
→ publication theo contract của collection

chuẩn bị object trước Thread.start()
→ start rule

chuẩn bị object trước Executor.execute/submit(...)
→ executor submission guarantee
```

### final field có initialization-safety đặc biệt

Java Memory Model có rule đặc biệt cho `final` field.

Ví dụ:

```java
final class UserSnapshot {
    private final String id;
    private final int level;

    UserSnapshot(String id, int level) {
        this.id = id;
        this.level = level;
    }
}
```

Nếu object được **construct đúng cách** và reference `this` không escape trước khi constructor hoàn tất, JMM cung cấp initialization-safety mạnh hơn cho các `final` field được gán trong constructor.

Mental model nên giữ:

```text
constructor hoàn tất đúng cách
        ↓
final fields được freeze theo JMM
        ↓
Thread khác có được reference tới object
        ↓
có guarantee đặc biệt để thấy giá trị final đã được khởi tạo
```

Điều này là một lý do immutable object với `final` fields rất hữu ích trong concurrent design.

Nhưng không nên suy thành:

```text
object có vài final fields
→ toàn bộ object tự động thread-safe
→ mọi mutable field / mutation sau constructor đều được publish an toàn
```

`final` bảo vệ semantics của final field initialization; nó không thay thế synchronization cho mutable shared state sau đó.

### this escape: publish object quá sớm

Một object bị **this escape** khi reference của chính nó có thể bị Thread khác quan sát trước khi constructor hoàn tất.

Ví dụ nguy hiểm về mặt design:

```java
class Listener {
    private final String configuration;

    Listener(EventBus bus) {
        bus.register(this); // this đã escape
        this.configuration = "READY";
    }
}
```

Nếu `register(this)` làm reference này trở nên reachable từ Thread khác ngay lập tức, Thread đó có thể quan sát object trong lúc construction chưa hoàn thành. Đây là lý do constructor nên hoàn thành invariant trước khi object được publish ra ngoài.

Pattern dễ reasoning hơn:

```text
construct hoàn chỉnh
→ thiết lập invariant
→ constructor return
→ publish object qua boundary rõ ràng
```

### Vì sao không có endpoint "unsafe publication"?

Tương tự reordering/stale-read demo, partially initialized observation của code có data race không phải outcome deterministic mà endpoint có thể bảo đảm tái hiện trên mọi JVM/machine.

Không quan sát được lỗi trong 10.000 lần chạy cũng không chứng minh unsafe publication là đúng.

Vì vậy module dùng **positive guarantees** để học:

```text
final-field initialization safety
volatile / monitor / Lock
Thread.start / join
Executor / Future / concurrent collection
```

thay vì săn một execution ngẫu nhiên của code không có guarantee.

**Kết luận:** concurrency design tốt không chỉ hỏi "object đã được tạo chưa?", mà còn hỏi **object được publish sang Thread khác bằng memory-consistency boundary nào** và **có escape trước khi construction hoàn tất hay không**.
