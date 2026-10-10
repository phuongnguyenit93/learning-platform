Controller:

```text
ProxyMentalModelController#compareManagedBeanAndPlainObject()
```

Endpoint:

```text
GET /aop/proxy/managed-vs-new
```

The experiment calls the same method through two different paths:

```text
Spring-managed bean
→ AOP proxy
→ advice
→ target

new ProxyMentalModelService(...)
→ plain Java object
→ target directly
```

The managed branch has these events:

```text
proxy-boundary:before-target
target:invokeTarget
proxy-boundary:after-target
```

The `new` branch only has:

```text
target:invokeTarget
```

`facts` also shows:

```text
managedIsAopProxy = true
plainIsAopProxy   = false
```

**Conclusion:** a correct pointcut expression is still not enough. The object must be inside the Spring AOP proxy boundary before advice has a chance to participate in the invocation.

---
