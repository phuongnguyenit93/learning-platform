Không nên học rule:

> `thenApplyAsync` chắc chắn chạy trên một Thread khác stage trước.

Rule hữu ích hơn:

- non-async dependent action có thể được thực thi bởi Thread hoàn thành stage hoặc Thread tham gia completion;
- async variant được submit để thực thi theo default async facility hoặc `Executor` được chỉ định;
- tên worker cụ thể không phải contract rằng nó bắt buộc khác worker stage trước.

Nếu execution policy quan trọng, truyền executor rõ ràng:

```java
future.thenApplyAsync(this::transform, executor);
```

Tham khảo:

```text
AsyncController#executionVariant()
GET /async/execution-variant
```

Experiment dùng một stage đã completed để cho thấy `thenApply` có thể chạy inline trên caller, trong khi `thenApplyAsync(..., executor)` được dispatch qua executor đã chỉ định. Kết luận cần giữ là **execution policy**, không phải giả định rằng mọi async variant luôn chạy trên một Thread khác stage trước.
