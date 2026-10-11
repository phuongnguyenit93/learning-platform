The module uses:

```text
@Aspect
@Pointcut
@Before
@Around
```

but the module build only declares the Spring Boot AOP starter and does not configure the AspectJ compiler or a load-time weaving agent.

The module's mental model is:

```text
@AspectJ-style declaration
        ↓
Spring ApplicationContext discovers the Aspect bean
        ↓
Spring AOP auto-proxy infrastructure
        ↓
proxy-based method interception
```

Do not see the `org.aspectj.lang...` package and conclude that the runtime is weaving bytecode with AspectJ.
