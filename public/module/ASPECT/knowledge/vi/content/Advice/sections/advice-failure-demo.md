Controller:

```text
AdviceLifecycleController#failure()
```

Endpoint:

```text
GET /aop/advice/failure
```

Target cố ý ném:

```text
IllegalStateException("intentional-advice-demo-error")
```

Controller bắt exception để experiment vẫn trả response quan sát được.

Event quan trọng:

```text
@Before
target:failure
@AfterThrowing
@After
```

`@AfterReturning` không chạy trên exception path.

Trong cùng một `@Aspect`, các advice **khác loại** có precedence semantics của framework. Với experiment này, `@AfterReturning`/`@AfterThrowing` được quan sát trước `@After` vì `@After` có finally-like semantics.

Ngược lại, nếu một Aspect khai báo **nhiều advice cùng loại** cùng match một join point, không nên dựa vào thứ tự source code của các method advice như một contract. Nếu thứ tự thật sự quan trọng, tách concern thành Aspect riêng và đặt precedence rõ ràng.
