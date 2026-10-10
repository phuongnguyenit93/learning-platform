Mental model:

```text
Advisor
├── Pointcut
│     └── which invocation matches?
│
└── Advice / MethodInterceptor
      └── what should happen after a match?
```

In annotation style, these two parts often appear next to each other:

```java
@Around("execution(...)")
public Object around(...) { ... }
```

At the lower Spring AOP API level, they can be independent objects combined by an `Advisor`.
