Some wrapper values may be cached, so identity demos can be misleading:

```java
Integer a = 100;
Integer b = 100;
a == b // true: 100 is inside the required cache range
```

Do not use wrapper identity as value equality. Prefer `equals` or explicit primitive comparison according to the contract.

For `Integer`, the platform guarantees caching for at least `-128..127` for the relevant boxing/valueOf semantics, which is exactly why `==` demos can mislead. The correct model is still: wrappers are objects; reference `==` checks identity.
