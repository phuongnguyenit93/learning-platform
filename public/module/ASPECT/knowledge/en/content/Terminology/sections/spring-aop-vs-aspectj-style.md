The module uses annotations such as:

```text
@Aspect
@Before
@Around
```

These annotations belong to the **@AspectJ declaration style**, but the runtime used by this module is still **proxy-based Spring AOP**.

Mental model:

```text
AspectJ annotation syntax
        ↓
Spring reads metadata + pointcut expression
        ↓
Spring creates an AOP proxy
        ↓
method invocation passes through the proxy
```

The module does not configure the AspectJ compiler or a load-time weaving agent.

So keep these three concepts separate:

```text
weaving
→ general AOP concept

Spring AOP runtime weaving
→ proxy-based

AspectJ compile-time / load-time weaving
→ bytecode weaving + broader join point model
```

Another important distinction:

```text
@Aspect
→ declares that a class has Aspect semantics

@Component or @Bean
→ puts the Aspect instance into the Spring ApplicationContext
```

`@Aspect` itself is not a component-scanning annotation. The Aspects in this module use both `@Aspect` and `@Component` because Spring needs the Aspect to exist as a bean before the auto-proxy infrastructure can use it.

Section `15.RuntimeBoundary` revisits this distinction at the infrastructure level.

---
