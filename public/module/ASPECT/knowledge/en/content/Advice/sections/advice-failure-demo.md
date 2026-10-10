Controller:

```text
AdviceLifecycleController#failure()
```

Endpoint:

```text
GET /aop/advice/failure
```

The target intentionally throws:

```text
IllegalStateException("intentional-advice-demo-error")
```

The controller catches the exception so the experiment can still return an observable response.

Important events:

```text
@Before
target:failure
@AfterThrowing
@After
```

`@AfterReturning` does not run on the exception path.

Within one `@Aspect`, advice methods of **different types** follow framework precedence semantics. In this experiment, `@AfterReturning`/`@AfterThrowing` are observed before `@After` because `@After` has finally-like semantics.

In contrast, if an Aspect declares **multiple advice methods of the same type** that match the same join point, do not use the source-code order of those advice methods as a contract. If order really matters, separate the concerns into different Aspects and declare explicit precedence.
