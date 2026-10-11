Controller:

```text
AdviceLifecycleController#success()
```

Endpoint:

```text
GET /aop/advice/success
```

Target:

```text
AdviceLifecycleService#success()
```

Khi target return bình thường, response sẽ có các event tương ứng với:

```text
@Before
target:success
@AfterReturning
@After
```

Điểm cần quan sát là `@AfterReturning` có thể đọc return value.
