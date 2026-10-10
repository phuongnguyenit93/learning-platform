Controller:

```text
PracticalPatternController#checkout(String)
```

Endpoint:

```text
GET /aop/patterns/checkout?item=book
```

Business method:

```text
PracticalPatternService#checkout(String)
```

Nó chỉ thực hiện behavior chính và khai báo:

```text
@AuditedOperation(action = "checkout")
```

Aspect:

```text
PracticalPatternAspect#audit(...)
```

Response `events` cho thấy:

```text
audit-start:action=checkout
target:checkout:item=book
audit-success:method=checkout
metric:elapsed-nanos=...
```

Business service không phải tự viết audit start/success hoặc timing.
