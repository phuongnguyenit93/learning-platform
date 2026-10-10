Controller:

```text
ProxyMentalModelController#compareManagedBeanAndPlainObject()
```

Endpoint:

```text
GET /aop/proxy/managed-vs-new
```

Experiment gọi cùng một method theo hai đường:

```text
Spring-managed bean
→ AOP proxy
→ advice
→ target

new ProxyMentalModelService(...)
→ plain Java object
→ target trực tiếp
```

Nhánh managed có event:

```text
proxy-boundary:before-target
target:invokeTarget
proxy-boundary:after-target
```

Nhánh `new` chỉ có:

```text
target:invokeTarget
```

`facts` còn cho thấy:

```text
managedIsAopProxy = true
plainIsAopProxy   = false
```

**Kết luận:** pointcut expression đúng vẫn chưa đủ. Object phải nằm trong Spring AOP proxy boundary thì advice mới có cơ hội tham gia invocation.

---
