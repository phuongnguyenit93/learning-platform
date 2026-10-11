Khi debug AOP, đừng chỉ hỏi "Aspect có chạy không?". Hãy tách thành hai câu hỏi:

```text
1. invocation có đi qua proxy không?
2. pointcut có match invocation đó không?
```

Hai điều kiện này độc lập và đều cần đúng.
