Module sử dụng các annotation:

```text
@Aspect
@Before
@Around
```

Các annotation này thuộc **@AspectJ declaration style**, nhưng runtime của module vẫn là **Spring AOP proxy-based**.

Mental model:

```text
AspectJ annotation syntax
        ↓
Spring đọc metadata + pointcut expression
        ↓
Spring tạo AOP proxy
        ↓
method invocation đi qua proxy
```

Module không cấu hình AspectJ compiler hay load-time weaving agent.

Vì vậy cần tách ba khái niệm:

```text
weaving
→ khái niệm AOP tổng quát

Spring AOP runtime weaving
→ proxy-based

AspectJ compile-time / load-time weaving
→ bytecode weaving + join point model rộng hơn
```

Một distinction khác rất quan trọng:

```text
@Aspect
→ khai báo class có semantics của Aspect

@Component hoặc @Bean
→ đưa Aspect instance vào Spring ApplicationContext
```

`@Aspect` tự nó không phải component-scanning annotation. Các Aspect trong module dùng cả `@Aspect` và `@Component` vì Spring cần Aspect đó tồn tại như một bean để auto-proxy infrastructure sử dụng.

Phần `15.RuntimeBoundary` sẽ quay lại distinction này ở mức infrastructure.

---
