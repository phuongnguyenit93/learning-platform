Advanced Spring AOP kết thúc ở mental model:

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

Khi hiểu được chain này, `@Aspect`, `@Around`, `@Order` hay self-invocation không còn là các rule rời rạc mà trở thành hệ quả của cùng một architecture.
