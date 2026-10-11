Đây là cầu nối trực tiếp với phần ThreadLocal.

Pattern:

```text
request/caller thread
    context = REQUEST-123
        ↓ submit
TaskDecorator capture REQUEST-123
        ↓
worker thread
        ↓ restore REQUEST-123
async method chạy
        ↓ finally
restore/remove worker context
```

Demo giữ `DemoContext` để nhìn rõ cơ chế capture/restore/cleanup, đồng thời propagate thêm hai context thực tế thường gặp trong Spring application:

- SLF4J MDC, ví dụ `requestId` dùng cho log correlation;
- Spring `RequestAttributes`, là context gắn với HTTP request hiện tại.

Tham khảo:

```text
DemoTaskDecorator
DemoContext
```

`DemoTaskDecorator` capture cả ba context trên caller thread, restore chúng trên worker, rồi restore/clear state cũ trong `finally`.

Rule quan trọng nhất của decorator không phải chỉ `set`, mà là **cleanup/restore trong finally** vì worker sẽ được reuse cho task khác. Nếu chỉ set MDC/RequestAttributes mà không cleanup, task sau chạy trên cùng worker có thể nhìn thấy context của request trước.

`TaskDecorator` cũng không nên được xem như universal async exception handler. Decorator nhận một `Runnable` execution callback; callback đó có thể là wrapper do framework/executor tạo ra thay vì business lambda gốc. Với execution theo `Future`/`FutureTask`, failure có thể được capture vào completion handle thay vì luôn thoát trực tiếp khỏi `Runnable.run()` để decorator bắt được. Vì vậy:

```text
TaskDecorator
→ context capture / restore / cleanup

Future / async handler / rejection handling
→ failure observation theo contract tương ứng
```

Không trộn hai trách nhiệm này chỉ vì chúng cùng nằm quanh execution boundary.

### Lifecycle của RequestAttributes

Propagation không kéo dài lifecycle của HTTP request. Một async task có thể sống lâu hơn request gốc; khi đó không nên giả định mọi object/request-scoped state lấy từ `RequestAttributes` vẫn còn hợp lệ để sử dụng tùy ý.

Nếu async work chỉ cần vài giá trị như `requestId`, tenant id hoặc principal id, design thường an toàn và rõ ràng hơn khi capture **giá trị cần thiết** sang một immutable context riêng thay vì giữ dependency dài hạn vào request object.
