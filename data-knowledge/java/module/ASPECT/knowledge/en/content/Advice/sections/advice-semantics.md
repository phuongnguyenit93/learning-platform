```text
@Before
→ runs before the target invocation

@AfterReturning
→ runs only when the target returns normally

@AfterThrowing
→ runs only when the target exits through a matching exception

@After
→ has finally-like semantics and runs when the invocation finishes, whether by success or exception
```

Do not interpret `@After` as "runs only after success".

Each advice type also has a different level of control:

```text
@Before
→ runs before invocation; has no proceed() API for intentionally skipping the target
→ but if the advice itself throws, the chain stops

@AfterReturning
→ observes the return value on the success path
→ does not replace the return value like @Around can

@AfterThrowing
→ observes an exception leaving the invocation
→ is not a strong recovery/control-flow API like @Around

@Around
→ has proceed() and can control the invocation chain
```

Choose the **weakest advice type that still satisfies the requirement**. Using `@Around` for every concern grants more control than necessary and makes the flow harder to read.
