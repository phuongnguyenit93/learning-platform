Java thread có thuộc tính daemon.

Điểm quan trọng nhất không phải daemon "chạy nền", mà là cách JVM quyết định thời điểm kết thúc.

### User thread và daemon thread

JVM tiếp tục tồn tại khi vẫn còn user thread còn sống.

Khi không còn user thread nào sống, JVM có thể kết thúc dù daemon thread vẫn chưa hoàn thành.

```text
User Thread còn sống
    → JVM tiếp tục chạy

Chỉ còn Daemon Thread
    → JVM không bắt buộc phải chờ daemon hoàn thành
```

Vì vậy daemon thread không phù hợp cho công việc bắt buộc phải hoàn tất trước khi process kết thúc, ví dụ ghi dữ liệu quan trọng mà không có cơ chế đảm bảo khác.

Daemon cũng **không đồng nghĩa priority thấp**. `daemon` là property liên quan JVM liveness/lifecycle; thread scheduling priority là khái niệm khác. Không suy ra một daemon thread sẽ tự động được CPU ưu tiên thấp hơn chỉ vì `isDaemon() == true`.

### Thread mới kế thừa daemon status

Khi tạo một Thread mới, daemon status mặc định được kế thừa từ thread tạo ra nó.

Có thể thay đổi trước khi start:

```java
Thread worker = new Thread(task);
worker.setDaemon(true);
worker.start();
```

Sau khi Thread đã được start, không thể thay đổi daemon flag bằng `setDaemon(...)`.

### Vì sao không dùng HTTP endpoint để chứng minh JVM exit?

Trong Spring Boot, kết thúc một HTTP request không đồng nghĩa JVM kết thúc.

Server vẫn có nhiều user thread khác đang sống.

Do đó kiểu demo:

```text
request kết thúc
→ kết luận daemon thread phải chết
```

là sai.

Controller chỉ phù hợp để quan sát daemon property, không phù hợp để chứng minh quy tắc shutdown của JVM.

### Demo trong Spring Boot

Tham khảo controller:

```text
DaemonThreadController#inspectDaemonRules()
```

Endpoint:

```text
GET /daemon/inspect
```

Demo cho thấy:

- daemon status của HTTP request thread;
- daemon status mà child thread kế thừa mặc định;
- giá trị sau khi chủ động gọi `setDaemon(true)` trước `start()`.

Khi chạy endpoint này, không kết luận gì về thời điểm JVM shutdown. Endpoint chỉ dùng để quan sát **daemon flag và inheritance rule**.

### Demo JVM lifecycle độc lập

File:

```text
src/main/java/com/example/learning/module/basic/thread/DaemonJvmExitDemo.java
```

Class này có `main()` riêng và phải chạy như một Java application độc lập.

Chạy với:

```text
true  → worker là daemon thread
false → worker là user thread
```

Khi `true`, `main` kết thúc trước worker và JVM không chờ worker hoàn thành.

Khi `false`, worker là user thread nên JVM tiếp tục sống cho đến khi worker hoàn thành.

**Kết luận:** HTTP demo giúp quan sát daemon property; `DaemonJvmExitDemo.main()` mới là experiment phù hợp để chứng minh JVM exit semantics.
