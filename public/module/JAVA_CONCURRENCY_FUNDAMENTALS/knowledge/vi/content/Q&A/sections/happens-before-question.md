Không chỉ như vậy.

Happens-before là relation của Java Memory Model mang visibility/ordering guarantee.

Các edge quan trọng đã học:

- program order;
- monitor unlock → later lock;
- volatile write → subsequent volatile read;
- `Thread.start()`;
- successful `Thread.join()`;
- submission vào `Executor` → task execution;
- asynchronous computation → code sau successful `Future.get()`;
- release/acquire edge của các synchronizer như latch/semaphore/lock;
- transitivity.

### Safe publication và final field liên quan gì tới happens-before/JMM?

Việc `new` xong một object không tự trả lời câu hỏi Thread khác nhận reference đó qua memory-consistency boundary nào. Publication nên đi qua một cơ chế có contract rõ ràng như volatile, lock/monitor, concurrent collection, `Thread.start()`, executor submission hoặc boundary tương đương.

`final` field có initialization-safety đặc biệt trong JMM nếu object được construct đúng cách và `this` không escape trước khi constructor hoàn tất. Điều đó làm immutable object với final fields dễ reasoning hơn trong concurrent code, nhưng không biến các mutable field hay mutation xảy ra sau constructor thành thread-safe.

Rule cần nhớ:

```text
construct hoàn chỉnh
→ không để this escape sớm
→ publish qua boundary rõ ràng
→ mới share object giữa các Thread
```
