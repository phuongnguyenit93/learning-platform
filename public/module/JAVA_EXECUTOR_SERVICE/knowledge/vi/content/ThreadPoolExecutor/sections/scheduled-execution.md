`ScheduledExecutorService` hỗ trợ ba semantics khác nhau cần phân biệt:

```text
schedule()
→ chạy một lần sau delay

scheduleAtFixedRate()
→ cố duy trì cadence theo mốc start dự kiến

scheduleWithFixedDelay()
→ chờ một delay sau khi lần chạy trước hoàn thành rồi mới lên lịch lần tiếp theo
```

`scheduleAtFixedRate()` không có contract cho phép cùng **một periodic task** tự overlap với chính nó. Nếu một lần chạy kéo dài hơn period, lần kế tiếp có thể bị trễ; scheduler không tự clone cùng task để chạy song song chỉ vì missed cadence.

Tham khảo:

```text
ThreadPoolController#scheduledExecution()
GET /thread-pool/scheduled-execution
```

Experiment chỉ chạy vài iteration rồi cancel cả hai periodic task và shutdown executor. Mục tiêu là học scheduling semantics mà không để background task sống sau request.

Method chạy mỗi mode riêng với `configuredIntervalMillis = 30`, task mô phỏng làm việc ít nhất khoảng `60 ms`, và ghi lại ba lần thực thi đầu tiên.
Trong `fixedRate.timeline` và `fixedDelay.timeline`, quan sát:

- `startMillis`, `endMillis`: thời điểm thực tế tính từ lúc chuẩn bị schedule.
- `workMillis`: thời gian thực thi đo được.
- `gapAfterPreviousEndMillis`: khoảng nghỉ từ lúc lần trước kết thúc đến lúc lần này bắt đầu; lần đầu là `null`.

Khi task lâu hơn period, fixed-rate thường chạy lần tiếp theo gần ngay sau khi lần trước xong để xử lý lịch đã trễ. Fixed-delay vẫn đợi khoảng delay đã cấu hình sau completion.
Scheduler/OS có thể gây trễ thêm, nên không assert một con số timing chính xác hoặc kết luận fixed-rate luôn nhanh hơn trong mọi lần chạy.
`noOverlapObserved` được tính từ các mốc thời gian. Vì demo dùng một worker, trường này chỉ xác nhận các lượt quan sát không overlap; guarantee không overlap của cùng periodic task đến từ Java API, không phải benchmark này.

### <a id="scheduled-failure">Exception trong periodic task</a>

Một semantics production rất quan trọng của `ScheduledExecutorService`: nếu một execution của periodic task ném exception ra ngoài, các execution tiếp theo của **cùng periodic task** bị suppress.

Điều này khác với suy nghĩ:

```text
run #1 lỗi
→ scheduler tự log rồi vẫn chạy #2, #3, #4...
```

Không nên dựa vào assumption đó.

Tham khảo:

```text
ThreadPoolController#scheduledFailure()
GET /thread-pool/scheduled-failure
```

Experiment tạo `scheduleAtFixedRate()` mà lần đầu luôn throw:

```text
run #1
→ IllegalStateException
→ ScheduledFuture complete exceptionally
→ runsObserved = 1
→ laterExecutionsSuppressed = true
```

`ScheduledFuture.get()` cho phép caller quan sát failure qua `ExecutionException`, nhưng production periodic job thường không có caller ngồi `get()`. Vì vậy task định kỳ cần logging/metrics/alerting và exception boundary phù hợp; nếu business muốn job tiếp tục sau một failure đã xử lý, task phải catch/handle failure theo policy rõ ràng.
