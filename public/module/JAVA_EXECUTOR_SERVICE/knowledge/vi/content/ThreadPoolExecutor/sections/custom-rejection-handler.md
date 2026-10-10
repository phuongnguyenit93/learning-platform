Bốn policy mặc định không phải lựa chọn duy nhất. `RejectedExecutionHandler` là extension point để application tự quyết định semantics khi admission thất bại.

Ví dụ production thường muốn:

- tăng metric `executor_rejected_total`;
- log pool/queue saturation;
- phát alert;
- reject rõ ràng để upstream retry/rate-limit;
- fallback sang durable queue **chỉ khi business contract cho phép và đã thiết kế idempotency/delivery semantics**.

Không nên tự động "đẩy sang Kafka" trong handler chỉ vì task bị reject; hành vi đó thay đổi delivery contract của hệ thống.

Tham khảo:

```text
ThreadPoolController#customRejectionHandler()
GET /thread-pool/custom-rejection-handler
```

Experiment làm đầy worker + queue rồi custom handler:

```text
rejectionCount = 1
exceptionObserved = true
customHandlerCanRecordOverload = true
```

**Kết luận:** rejection nên được coi là tín hiệu overload có thể quan sát và xử lý theo business semantics, không chỉ là exception kỹ thuật.
