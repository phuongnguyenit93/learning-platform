Trước hết application phải bật async method execution infrastructure. Trong module:

```java
@Configuration
@EnableAsync
class TaskExecutorConfig {
}
```

`@EnableAsync` yêu cầu Spring đăng ký infrastructure cần thiết để detect/intercept method có `@Async` theo async configuration hiện tại.

Mental model:

```text
@EnableAsync
→ enable async method execution infrastructure

@Async
→ đánh dấu method invocation cần được async interceptor xử lý

TaskExecutor
→ execution strategy thực tế
```

`@Async` đứng một mình không phải Java language feature và không tự biến method call thành asynchronous nếu application context không bật/cấu hình async support tương ứng.

Khi method được gọi qua Spring proxy:

```text
caller
→ proxy intercept @Async method
→ submit invocation vào TaskExecutor
→ caller nhận control/result handle
→ worker thực thi method
```

Vì vậy `@Async` không phải keyword của Java và không tự tạo "phép màu" bên trong method.

### Self-invocation

Nếu một method trong bean gọi trực tiếp một `@Async` method khác trên chính `this`, lời gọi có thể không đi qua proxy, vì vậy async interception không xảy ra theo proxy mode mặc định.

Design thường rõ ràng hơn khi async boundary nằm giữa hai Spring bean.
