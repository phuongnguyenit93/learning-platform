`LongAdder` hữu ích cho counter có contention cao. Nó phân tán update vào nhiều cell rồi tổng hợp bằng `sum()`.

### Giới hạn khi đọc tổng trong lúc vẫn có writer

`sum()` **không bảo đảm atomic snapshot** của toàn bộ counter khi các Thread khác vẫn update. Không nên diễn giải thành chỉ có một độ trễ cố định hoặc luôn trả một snapshot tại một thời điểm duy nhất.

Khi không còn concurrent update, `sum()` trả tổng chính xác. Vì vậy experiment `atomicTools()` chờ `join()` toàn bộ worker trước khi đọc tổng:

```text
4 workers × 1.000 increments
→ join tất cả workers
→ atomicInteger = longAdder = expectedCount = 4.000
```

Kết quả bằng nhau sau join không chứng minh `LongAdder` thay thế được mọi use case của `AtomicLong`.
Dùng adder cho thống kê/metrics; với sequence ID hoặc admission kiểu "chỉ cho tối đa N request vào", cần atomic state transition hoặc primitive phù hợp như Semaphore. Không dùng `sum() < limit` rồi `increment()` như một thao tác nguyên tử.

Tham khảo contract: [LongAdder.sum() — Java 21](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/LongAdder.html#sum()).

### LongAccumulator

`LongAccumulator` tổng quát hóa ý tưởng bằng một accumulator function.

Accumulator function nên phù hợp với cách kết quả trung gian được kết hợp. Các phép như `sum`, `max`, `min` là ví dụ dễ reasoning.

Không nên dùng một phép toán phụ thuộc thứ tự hoặc không kết hợp được rồi kỳ vọng kết quả giống xử lý tuần tự.

Ngoài ra accumulator function nên **side-effect-free**. Implementation có thể phải áp dụng lại function trong quá trình concurrent update/retry, nên không được coi mỗi lần function được gọi là một business action "exactly once".

Không viết kiểu:

```java
(current, value) -> {
    sendEmail();
    auditLog();
    return Math.max(current, value);
}
```

Side effect phải nằm ngoài reduction function; function nên chỉ tính result từ các argument của nó.

Tham khảo:

```text
SynchronizationController#atomicTools()
GET /synchronization/atomic-tools
```

Demo sử dụng:

- `AtomicInteger` cho exact counter;
- `LongAdder` cho concurrent additions;
- `LongAccumulator` với phép `max`.
