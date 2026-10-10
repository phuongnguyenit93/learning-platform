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

It performs only the main behavior and declares:

```text
@AuditedOperation(action = "checkout")
```

Aspect:

```text
PracticalPatternAspect#audit(...)
```

The response `events` shows:

```text
audit-start:action=checkout
target:checkout:item=book
audit-success:method=checkout
metric:elapsed-nanos=...
```

The business service does not have to implement audit start/success or timing itself.
