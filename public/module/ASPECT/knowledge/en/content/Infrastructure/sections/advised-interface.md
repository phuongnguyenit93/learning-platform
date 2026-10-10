A Spring AOP proxy commonly exposes the infrastructure interface:

```text
Advised
```

which can be used to inspect:

```text
Advisor[]
```

This is useful for debugging or learning the architecture, but normal application code should not depend deeply on `Advised` for business flow.
