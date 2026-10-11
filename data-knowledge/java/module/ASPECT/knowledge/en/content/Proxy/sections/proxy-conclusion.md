An annotation or pointcut alone is not enough for advice to run.

The correct mental model is:

```text
method call
→ passes through Spring proxy
→ pointcut matches
→ advice has a chance to run
```

The self-invocation chapter later demonstrates a case where a method has an annotation but the call does not go back through the proxy.
