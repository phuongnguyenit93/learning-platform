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

When the target returns normally, the response contains events corresponding to:

```text
@Before
target:success
@AfterReturning
@After
```

The important observation is that `@AfterReturning` can read the return value.
