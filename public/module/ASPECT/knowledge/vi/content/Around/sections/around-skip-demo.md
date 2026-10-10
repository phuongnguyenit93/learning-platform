Controller:

```text
AroundAdviceController#skip()
```

Endpoint:

```text
GET /aop/around/skip
```

Aspect cố ý **không gọi `proceed()`**.

Response sẽ có:

```text
result = returned-without-calling-target
events = [around:skip-proceed]
```

Sẽ không có:

```text
target:skippedTarget
```

vì target method chưa từng được thực thi.
