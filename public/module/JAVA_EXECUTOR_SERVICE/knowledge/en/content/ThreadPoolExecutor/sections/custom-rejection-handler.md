Four default policies aren't the only options. `RejectedExecutionHandler` is an extension point for the application to decide on its own semantics when the admission fails.

For example, production usually wants:

- Increase metrics `executor_rejected_total`;
- log pool/queue saturation;
- broadcast alert;
- explicit reject for upstream retry/rate-limit;
- Fallback Sang Durable Queue **Only if the business contract allows and has designed idempotency/delivery semantics**.

Don't automatically "push to Kafka" in the handler just because the task is rejected; that behavior changes the delivery contract of the system.

References:

```text
ThreadPoolController#customRejectionHandler()
GET /thread-pool/custom-rejection-handler
```

Experiment filling worker + queue then custom handler:

```text
rejectionCount = 1
exceptionObserved = true
customHandlerCanRecordOverload = true
```

**Final Thoughts** Rejection should be considered an overload signal that can be observed and processed according to business semantics, not just a technical exception.
