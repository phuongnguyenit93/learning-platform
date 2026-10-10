`volatile` thường được dùng khi một variable đóng vai trò publication/signal.

Ví dụ:

```java
int data = 0;
volatile boolean ready = false;

// writer
data = 42;
ready = true;

// reader
if (ready) {
    System.out.println(data);
}
```

Mental model nên dùng:

```text
write data = 42
        ↓ program order
write volatile ready = true
        ↓ volatile happens-before
read volatile ready == true
        ↓ program order
read data
```

Nhờ transitivity, reader thấy `ready == true` theo đúng volatile synchronization thì các write trước đó của writer cũng được publication đúng theo JMM.

Không cần diễn giải bằng câu:

```text
volatile = luôn đọc thẳng RAM
```

Đây không phải contract mà Java programmer cần dựa vào.

### Demo volatile publication

Tham khảo:

```text
ConcurrencyProblemController#volatilePublication()
```

Endpoint:

```text
GET /concurrency/problem/volatile-publication
```

Kết quả kỳ vọng:

```text
publishedData = 42
readerObservedData = 42
ready = true
```

**Kết luận:** volatile flag có thể publish những write xảy ra trước nó tới reader đọc flag đó sau này.

### volatile không làm count++ atomic

Một biến có thể là `volatile` nhưng compound operation vẫn race:

```java
volatile int count;

count++;
```

Visibility của read/write không biến toàn bộ read-modify-write sequence thành một action atomic.

Tham khảo:

```text
ConcurrencyProblemController#volatileIsNotAtomic()
```

Endpoint:

```text
GET /concurrency/problem/volatile-not-atomic
```

Experiment dùng cùng kỹ thuật deterministic lost-update như race demo, nhưng field được khai báo `volatile`.

Kết quả vẫn là:

```text
expectedSequentialResult = 2
actualResult = 1
```

**Kết luận:** `volatile` giải quyết một lớp vấn đề memory visibility/ordering; nó không thay thế `AtomicInteger`, `synchronized` hay lock cho compound update.
