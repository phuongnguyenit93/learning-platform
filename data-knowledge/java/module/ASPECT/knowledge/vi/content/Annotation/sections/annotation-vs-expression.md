Annotation phù hợp khi behavior có thể xem như một contract rõ ràng:

```text
@TrackExecution
@Audited
@Measured
```

Nó thường dễ đọc hơn một pointcut phụ thuộc quá sâu vào package hoặc method naming convention.

Nhưng annotation không tự đảm bảo advice sẽ chạy. Invocation vẫn phải đi qua proxy.
