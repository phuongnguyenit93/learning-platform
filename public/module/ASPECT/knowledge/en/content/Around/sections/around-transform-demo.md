Controller:

```text
AroundAdviceController#transform()
```

Endpoint:

```text
GET /aop/around/transform
```

The target returns:

```text
original-result
```

But the caller receives:

```text
original-result|transformed-by-around
```

This experiment proves that advice can change the contract observed by the caller. In production code, this capability should be used very carefully.
