Controller:

```text
AroundAdviceController#skip()
```

Endpoint:

```text
GET /aop/around/skip
```

The Aspect intentionally **does not call `proceed()`**.

The response contains:

```text
result = returned-without-calling-target
events = [around:skip-proceed]
```

It does not contain:

```text
target:skippedTarget
```

because the target method was never executed.
