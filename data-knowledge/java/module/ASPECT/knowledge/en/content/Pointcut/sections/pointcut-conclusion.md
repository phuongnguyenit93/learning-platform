When debugging AOP, do not only ask "did the Aspect run?". Split the problem into two questions:

```text
1. did the invocation pass through the proxy?
2. did the pointcut match that invocation?
```

These conditions are independent, and both must be true.
