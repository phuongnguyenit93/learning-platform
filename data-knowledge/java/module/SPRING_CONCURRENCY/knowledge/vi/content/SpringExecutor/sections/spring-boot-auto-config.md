Không nên nói chung rằng:

> Không cấu hình executor thì `@Async` luôn dùng `SimpleAsyncTaskExecutor`.

Đó có thể là cách mô tả fallback ở Spring Framework trong một số trường hợp, nhưng application đang dùng **Spring Boot 3.3.x**, nơi Boot có task execution auto-configuration.

Trong cấu hình mặc định không dùng virtual threads, Boot thường cung cấp `ThreadPoolTaskExecutor` cho task execution nếu application chưa tự định nghĩa executor phù hợp.

Khi virtual threads được bật bằng cấu hình Boot tương ứng, auto-configured task executor có thể chuyển sang implementation sử dụng virtual threads.

Vì custom bean hoặc `AsyncConfigurer` có thể thay đổi lựa chọn cuối cùng, khi behavior quan trọng hãy kiểm tra executor thực tế của application thay vì dựa trên một câu fallback chung.
