Happens-before không đơn giản là "A xảy ra trước B theo đồng hồ".

Nếu action A happens-before action B thì những effect của A được đảm bảo visible với B theo Java Memory Model.

Một số rule nền tảng:

### Program order

Trong một Thread, các action trước đó happens-before các action sau đó theo program order semantics.

### Thread start rule

Những action xảy ra trước:

```java
thread.start();
```

happens-before các action trong Thread được start.

### Thread join rule

Mọi action trong worker Thread happens-before code tiếp tục sau khi một Thread khác `join()` worker thành công.

### Monitor rule

Unlock trên một monitor happens-before lần lock monitor đó sau này.

### Volatile rule

Write vào một volatile variable happens-before một subsequent read của chính volatile variable đó theo rule của JMM.

### Transitivity

Nếu:

```text
A happens-before B
B happens-before C
```

thì:

```text
A happens-before C
```

### Higher-level java.util.concurrent cũng mang memory guarantees

Happens-before không dừng ở `synchronized`, `volatile`, `start()` và `join()`.

Các abstraction trong `java.util.concurrent` xây higher-level guarantee trên cùng memory model. Một số edge rất thực tế:

```text
actions trước Executor.execute/submit(task)
→ happen-before actions trong task khi task bắt đầu chạy

actions của asynchronous computation
→ happen-before code sau Future.get() thành công ở Thread khác

actions trước CountDownLatch.countDown()
→ happen-before actions sau await() thành công

actions trước Semaphore.release()
→ happen-before actions sau acquire() thành công trên cùng synchronizer

put/access qua concurrent collection phù hợp
→ có publication guarantee được API định nghĩa cho element đó
```

Điều này rất quan trọng về mental model: dùng `Executor`, `Future`, synchronizer hay concurrent collection không có nghĩa programmer rời khỏi JMM; các API đó cung cấp những synchronization edge cấp cao hơn để programmer không phải tự dựng tất cả bằng volatile/monitor.

### Demo start / join

Tham khảo:

```text
ConcurrencyProblemController#startJoinHappensBefore()
```

Endpoint:

```text
GET /concurrency/problem/happens-before-start-join
```

Experiment có flow:

```text
request thread ghi beforeStart = 7
        ↓
worker.start()
        ↓
worker đọc beforeStart
worker ghi writtenByWorker = 42
        ↓
worker.join()
        ↓
request thread đọc writtenByWorker
```

Kết quả kỳ vọng:

```text
workerObservedBeforeStart = 7
parentObservedAfterJoin = 42
```

**Kết luận:** `start()` và `join()` không chỉ điều phối lifecycle. Chúng còn mang memory-consistency guarantee.
