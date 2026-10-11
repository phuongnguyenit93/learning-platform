The module only declares:

```groovy
implementation 'org.springframework.boot:spring-boot-starter-aop'
```

and `AspectApplication` does not need to add:

```java
@EnableAspectJAutoProxy
```

In Spring Boot, AOP is auto-configured when the required dependency and conditions are present. Two important settings are:

```text
spring.aop.auto
→ defaults to true

spring.aop.proxy-target-class
→ defaults to true in Spring Boot
→ prefers class-based/CGLIB proxies
```

These are **documented Boot defaults**. They do not mean the application must explicitly contain both properties in `application.yml`.

If this is changed:

```properties
spring.aop.proxy-target-class=false
```

the auto-proxy infrastructure may use JDK dynamic proxies when the target exposes an appropriate interface.

This explains why many Spring-managed beans in the module currently report:

```text
isCglibProxy = true
```

even though chapter `11.ProxyFactory` can still create both JDK and CGLIB proxies programmatically.
