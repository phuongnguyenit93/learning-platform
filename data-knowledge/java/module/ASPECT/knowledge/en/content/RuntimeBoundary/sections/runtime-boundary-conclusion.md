Advanced Spring AOP ends with this mental model:

```text
Declarative annotation
        ↓
Pointcut / Advisor
        ↓
Auto Proxy Creator
        ↓
Proxy
        ↓
Interceptor chain
        ↓
Target
```

Once this chain is understood, `@Aspect`, `@Around`, `@Order`, and self-invocation stop being isolated rules and become consequences of the same architecture.
