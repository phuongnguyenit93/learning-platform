Khi task được submit sang executor, context propagation thường cần ba bước:

```text
caller Thread
   ↓ capture context
wrap Runnable/Callable
   ↓
worker Thread
   ↓ restore context
run task
   ↓ finally
cleanup / restore previous context
```

Tham khảo:

```text
ThreadLocalController#explicitPropagation()
GET /context/explicit-propagation
```

Demo tạo worker trước khi parent set context, sau đó wrap task để worker vẫn nhận đúng context ở thời điểm submit.

Trong Spring, `TaskDecorator` là một nơi phù hợp để đóng gói pattern này cho `ThreadPoolTaskExecutor`; module `framework/spring-framework/concurrency` sẽ thực hành trực tiếp.

Ngoài việc tự wrap task hoặc dùng `TaskDecorator`, hệ sinh thái Java còn có các giải pháp propagation chuyên dụng. Ví dụ `TransmittableThreadLocal` của Alibaba mở rộng ý tưởng capture/replay context cho executor reuse. Tuy nhiên đây là **library-specific solution**, không thay đổi mental model cốt lõi:

```text
capture context tại submission boundary
→ restore trước khi task chạy
→ cleanup/restore previous state sau task
```

Vì vậy chapter này ưu tiên explicit propagation và Spring `TaskDecorator`; library bên thứ ba chỉ nên được chọn khi semantics và integration của nó phù hợp với application thật.
