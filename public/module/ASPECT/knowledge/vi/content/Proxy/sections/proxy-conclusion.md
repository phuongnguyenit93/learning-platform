Annotation hoặc pointcut tự nó chưa đủ để advice chạy.

Mental model đúng là:

```text
method call
→ đi qua Spring proxy
→ pointcut match
→ advice có cơ hội chạy
```

Chapter self-invocation sau này sẽ chứng minh trường hợp method có annotation nhưng call không quay lại qua proxy.
