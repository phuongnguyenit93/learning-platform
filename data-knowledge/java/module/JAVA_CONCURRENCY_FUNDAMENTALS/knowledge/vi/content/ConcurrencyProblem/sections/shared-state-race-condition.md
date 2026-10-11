### Shared Mutable State là gì?

Một object trở thành shared mutable state khi:

```text
shared
→ nhiều Thread có thể truy cập cùng object

mutable
→ object đó có state có thể thay đổi
```

Ví dụ:

```java
class Counter {
    int value;
}
```

Nếu hai Thread cùng thao tác trên `value`, kết quả có thể phụ thuộc vào cách các thao tác xen kẽ nhau.

### Vì sao count++ không atomic?

`count++` nhìn giống một thao tác, nhưng về mặt logic là một read-modify-write sequence:

```text
read count
    ↓
count + 1
    ↓
write count
```

Hai Thread có thể cùng đọc một giá trị cũ rồi cùng ghi kết quả mới dựa trên snapshot đó.

Ví dụ:

```text
ban đầu count = 0

Thread A đọc 0
Thread B đọc 0

Thread A ghi 1
Thread B ghi 1

kỳ vọng tuần tự = 2
thực tế = 1
```

Đây là **lost update**.

### Race condition khác data race như thế nào?

**Race condition** là vấn đề correctness: kết quả đúng/sai phụ thuộc vào thứ tự xen kẽ các thao tác mà chương trình chưa kiểm soát.

**Data race** có nghĩa cụ thể trong JMM: hai Thread truy cập cùng một variable, ít nhất một truy cập là write, và hai truy cập xung đột đó không được sắp thứ tự bởi happens-before.

Ví dụ:

| Code | Vấn đề |
| --- | --- |
| Hai Thread cùng `count++` trên field `int` thường, không đồng bộ | Có data race và có thể lost update |
| Hai Thread cùng `count++` trên field `volatile int` | Từng read/write có volatile semantics, nhưng compound increment vẫn có race condition |
| `get()` rồi `put()` riêng rẽ trên `ConcurrentHashMap` để tăng counter | Collection bảo vệ từng operation; chuỗi check/read/update vẫn có thể race |

Vì vậy **không có data race chưa đủ để bảo đảm mọi business operation nguyên tử**. Cần xác định phạm vi invariant cần bảo vệ.
Hai endpoint `race-condition` và `volatile-not-atomic` bên dưới giúp đối chiếu: cả hai đều có thể lost update, dù cơ chế đồng bộ của field khác nhau.

### Demo trong module

Tham khảo controller:

```text
ConcurrencyProblemController#raceCondition()
```

Endpoint:

```text
GET /concurrency/problem/race-condition
```

Experiment cố tình chia thao tác increment thành hai phase:

```text
Thread A đọc snapshot
Thread B đọc snapshot
        ↓
cả hai mới được phép ghi
```

Việc điều phối này chỉ dùng để làm race **deterministic** cho mục đích học tập.

Kết quả kỳ vọng:

```text
snapshotA = 0
snapshotB = 0
expectedSequentialResult = 2
actualResult = 1
lostUpdates = 1
```

**Kết luận:** race condition không có nghĩa là kết quả lúc nào cũng sai. Nó có nghĩa là correctness phụ thuộc vào interleaving/timing mà code không kiểm soát.
