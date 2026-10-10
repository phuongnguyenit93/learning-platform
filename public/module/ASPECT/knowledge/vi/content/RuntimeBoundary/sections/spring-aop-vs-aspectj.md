Spring AOP tập trung vào method execution trên Spring-managed object qua proxy boundary.

Full AspectJ weaving có model rộng hơn và có thể tác động ở những join point không cần đi qua Spring proxy, tùy kiểu weaving/configuration.

Một điểm khác nằm ở around advice argument rewriting. Chapter 6 dùng:

```text
ProceedingJoinPoint#proceed(Object[])
```

theo semantics của Spring AOP: array mới đại diện cho arguments của underlying method invocation. Nếu cùng source Aspect được compile bởi AspectJ compiler thì semantics của arguments truyền vào `proceed(...)` không hoàn toàn giống vậy; chúng gắn với các parameter được bind vào around advice signature. Đây là một lý do không nên coi "@AspectJ syntax giống nhau" là bằng chứng hai runtime hoàn toàn tương đương.

Module này cố ý không chuyển sang compile-time/load-time AspectJ vì mục tiêu chính là hiểu Spring AOP.

Do đó câu hỏi debug chuẩn trong module luôn bắt đầu từ:

```text
1. object có phải Spring-managed/proxied không?
2. invocation có đi qua proxy không?
3. Advisor/pointcut có match không?
4. interceptor/advice chain chạy thế nào?
```
