Trong experiment của module:

```text
TerminologyAspect
→ Aspect

explainTerms(...)
→ Advice

execution(...TerminologyService.execute(..))
→ Pointcut expression

TerminologyService.execute()
→ Join Point (method execution) đang được chọn

TerminologyService instance
→ Target Object

object được inject vào Controller
→ AOP Proxy
```

Trong **Spring AOP**, join point model là **method execution**. Pointcut chọn một subset các method execution đó, còn proxy boundary quyết định invocation có thực sự đi vào AOP chain hay không.

`weaving` là thuật ngữ AOP tổng quát cho quá trình liên kết Aspect với target/advised object. Spring AOP thực hiện việc này ở runtime bằng proxy; full AspectJ còn có compile-time hoặc load-time weaving và hỗ trợ join point model rộng hơn.
