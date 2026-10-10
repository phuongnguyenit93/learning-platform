Một ưu điểm lớn của Spring-managed executor là container có thể quản lý lifecycle.

`ThreadPoolTaskExecutor` có các tùy chọn liên quan shutdown như:

- chờ task hoàn thành;
- timeout chờ termination.

Nhưng "Spring quản lý" không có nghĩa mọi task chắc chắn hoàn thành. Shutdown policy và timeout vẫn phải khớp SLA/deployment termination window.

Tham khảo cấu hình của module:

```text
TaskExecutorConfig#threadLearningTaskExecutor()
```

Method này hiện cấu hình cả:

```text
setWaitForTasksToCompleteOnShutdown(true)
setAwaitTerminationSeconds(2)
```

Hai giá trị demo nhỏ để demo lifecycle; production phải khớp termination window của process/container và thời gian task thực tế.
