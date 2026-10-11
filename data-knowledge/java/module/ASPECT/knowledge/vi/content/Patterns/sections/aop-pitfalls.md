### Pointcut quá rộng

```text
execution(* com.example..*(..))
```

có thể intercept nhiều method hơn ý định và làm behavior khó dự đoán.

### Aspect chứa business logic

Nếu quyết định giá, trạng thái order hoặc workflow chính nằm trong Aspect, dependency trở nên ẩn và khó test/debug.

### Thay đổi argument/return value âm thầm

`@Around` có thể làm được, nhưng khả năng kỹ thuật không đồng nghĩa đó là design tốt.

### Swallow exception

Aspect bắt exception rồi trả một giá trị giả có thể phá contract của target và che lỗi.

### Quá nhiều ordering dependency

Nếu correctness phụ thuộc một chuỗi `@Order` phức tạp, abstraction thường đã vượt quá mức AOP nên gánh.

### Mutable state trong Aspect

Aspect bean thông thường là singleton trong ApplicationContext. Vì vậy field mutable kiểu:

```java
private int currentRequestCount;
```

có thể bị nhiều request/thread cùng truy cập và tạo race condition hoặc leak state giữa các invocation.

Ưu tiên Aspect stateless. Nếu thật sự cần state, phải thiết kế scope/concurrency semantics rõ ràng thay vì mặc định coi mỗi invocation có một Aspect instance riêng.

`AopTraceLog` trong learning module dùng `ThreadLocal` chỉ để tách event của từng request/thread khi quan sát experiment. Đây là instrumentation phục vụ học tập, không phải lý do để nhét business state vào `ThreadLocal` của Aspect.
