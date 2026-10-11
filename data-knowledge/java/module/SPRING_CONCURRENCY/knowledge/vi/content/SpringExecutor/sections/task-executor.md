`org.springframework.core.task.TaskExecutor` là abstraction của Spring cho việc thực thi task.

Nó gần với `Executor` của Java nhưng được tích hợp vào Spring container.

`ThreadPoolTaskExecutor` là implementation phổ biến, bên dưới sử dụng `ThreadPoolExecutor` và expose các cấu hình như:

- core pool size;
- max pool size;
- queue capacity;
- keep-alive;
- thread name prefix;
- rejection handler;
- TaskDecorator;
- shutdown behavior.

Mental model vẫn là phần Thread Pool đã học:

```text
core → queue → max → rejection
```

Spring không thay đổi quy tắc cơ bản này.

Một điểm riêng của Spring là exception type ở abstraction boundary. `ThreadPoolTaskExecutor` thực hiện Spring `TaskExecutor` contract; khi task bị từ chối, caller nên xử lý theo Spring rejection semantics như `TaskRejectedException` thay vì viết code phụ thuộc rằng raw `RejectedExecutionException` của JDK luôn đi xuyên qua không đổi.

Nếu cần custom overload policy ở tầng JDK, underlying `ThreadPoolExecutor` vẫn dùng `RejectedExecutionHandler`; nhưng public contract mà application gọi qua `TaskExecutor` là contract của Spring.
