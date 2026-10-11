Mental model:

```text
Advisor
├── Pointcut
│     └── invocation nào match?
│
└── Advice / MethodInterceptor
      └── match rồi làm gì?
```

Trong annotation style, hai phần thường xuất hiện cạnh nhau:

```java
@Around("execution(...)")
public Object around(...) { ... }
```

Ở Spring AOP API thấp hơn, chúng có thể là hai object độc lập rồi được ghép bởi `Advisor`.
