Module dùng:

```text
@Aspect
@Pointcut
@Before
@Around
```

nhưng build của module chỉ khai báo Spring Boot AOP starter và không cấu hình AspectJ compiler hoặc load-time weaving agent.

Mental model của module là:

```text
@AspectJ-style declaration
        ↓
Spring ApplicationContext phát hiện Aspect bean
        ↓
Spring AOP auto-proxy infrastructure
        ↓
proxy-based method interception
```

Không nên nhìn package `org.aspectj.lang...` rồi kết luận runtime đang weave bytecode bằng AspectJ.
