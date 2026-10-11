Sau khi hiểu proxy + Advisor + interceptor chain, có thể dùng cùng mental model để đọc nhiều feature declarative trong Spring ecosystem, ví dụ:

```text
transaction management
caching
method security
async method execution
```

Implementation cụ thể của từng feature có thể khác nhau, nhưng câu hỏi về proxy boundary, method interception và self-invocation thường vẫn rất hữu ích.

Một boundary khác cần nhớ với async/reactive API:

```text
@Around đo thời gian method invocation
≠
thời điểm CompletableFuture / Mono / Flux hoàn tất công việc bất đồng bộ
```

Nếu method return một async/reactive container rất nhanh, advice có thể kết thúc trước khi workload thật sự hoàn thành. Muốn đo end-to-end completion cần instrumentation phù hợp với abstraction async/reactive đó, không chỉ đo thời gian quanh `proceed()`.
