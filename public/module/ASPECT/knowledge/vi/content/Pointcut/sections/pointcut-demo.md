Controller:

```text
PointcutController#comparePointcuts()
```

Endpoint:

```text
GET /aop/pointcut/compare
```

Controller lần lượt gọi:

```text
PointcutService#byExecution()
PointcutService#byAnnotation()
PointcutService#byArgs("demo")
PointcutService#byRuntimeArgs("runtime-string")
PointcutService#byWithin()
PointcutService#byThisAndTarget()
PointcutService#byBean()
PointcutService#unmatched()
```

Aspect:

```text
PointcutMatchingAspect
```

Response `events` sẽ cho thấy:

```text
pointcut:execution
target:byExecution

pointcut:@annotation
target:byAnnotation

pointcut:args:demo
target:byArgs:demo

pointcut:args-runtime-type=String
target:byRuntimeArgs:runtime-string:declaredType=Object

pointcut:within+named-composition
target:byWithin

(xuất hiện cả pointcut:this-proxy-type và pointcut:target-type)
target:byThisAndTarget

pointcut:bean-name
target:byBean

target:unmatched
```

`unmatched()` cố ý không match bất kỳ advice nào để làm baseline so sánh.

`byRuntimeArgs(Object)` cố ý khai báo parameter là `Object` nhưng Controller truyền một `String`. Advice dùng:

```text
args(java.lang.String)
```

vẫn match vì `args(...)` xét **runtime argument type**. Đây là distinction quan trọng với `execution(...)`: `execution(...)` chủ yếu nhìn declared method signature, còn `args(...)` nhìn shape/type của argument tại runtime.

`byWithin()` còn chứng minh named pointcut composition:

```text
pointcutServiceType()
&&
byWithinMethod()
```

`this(...)` và `target(...)` có thể cùng match trong experiment hiện tại, nhưng semantics khác nhau:

```text
this(...)
→ nhìn type của proxy object

target(...)
→ nhìn type của target object phía sau proxy
```

Không dùng thứ tự giữa hai event `pointcut:this-proxy-type` và `pointcut:target-type` làm learning contract. Chúng đến từ hai advice cùng precedence và experiment chỉ cần chứng minh **cả hai matching rule đều true** cho invocation hiện tại.

Sự khác nhau trở nên rõ hơn khi học JDK proxy và CGLIB ở Advanced.

`bean(pointcutService)` là một designator đặc trưng của Spring AOP: nó chọn join point dựa trên identity/name của Spring bean, thay vì chỉ nhìn Java type hoặc method signature.
