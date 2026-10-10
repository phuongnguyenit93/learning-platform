Config dùng bean riêng:

```text
threadLearningTaskExecutor
```

để các experiment dùng một executor có cấu hình rõ ràng và dễ quan sát.

Các giá trị demo nhỏ vì mục tiêu là học semantics, không phải production sizing.

Sizing production vẫn phải dựa vào workload/downstream/SLO như phần Thread Pool.

Tham khảo code:

```text
TaskExecutorConfig#threadLearningTaskExecutor()
```

### Demo config và production config là hai mục tiêu khác nhau

Demo cố ý hard-code giá trị nhỏ:

```java
executor.setCorePoolSize(2);
executor.setMaxPoolSize(4);
executor.setQueueCapacity(8);
```

để experiment dễ quan sát và không phụ thuộc environment.

Production thường nên externalize những giá trị vận hành cần tuning, ví dụ:

```yaml
application:
  async:
    core-pool-size: 8
    max-pool-size: 32
    queue-capacity: 500
    keep-alive-seconds: 60
    await-termination-seconds: 30
```

rồi bind bằng một configuration object:

```java
@ConfigurationProperties(prefix = "application.async")
public class AsyncExecutorProperties {
    private int corePoolSize;
    private int maxPoolSize;
    private int queueCapacity;
    private int keepAliveSeconds;
    private int awaitTerminationSeconds;
}
```

Sau đó config executor lấy giá trị từ properties thay vì hard-code.

Lợi ích:

- dev/staging/production có thể dùng sizing khác nhau mà không sửa code;
- deployment platform có thể override bằng environment/config;
- thay đổi operational tuning không bị trộn với business logic;
- dễ review rõ đâu là semantics của executor, đâu là con số phù hợp với workload hiện tại.

Nhưng externalize không có nghĩa mọi property đều nên cho phép chỉnh tùy ý. Rejection policy, context propagation hoặc safety limit quan trọng vẫn cần default/validation rõ ràng để tránh một config sai làm biến đổi semantics hệ thống.

Mental model:

```text
learning demo
→ hard-code nhỏ, deterministic

production
→ typed configuration + validation
→ environment-specific values
→ metrics/load test để tuning
```

Không copy các con số demo `2/4/8` sang production và cũng không dùng công thức CPU-bound/I/O-bound như một giá trị tuyệt đối.
