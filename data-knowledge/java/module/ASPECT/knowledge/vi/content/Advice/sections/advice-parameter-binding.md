Các chapter trong module đang dùng nhiều kiểu binding khác nhau. Gom lại thành một mental model:

```text
JoinPoint
→ signature / this / target / arguments

args(value)
→ bind runtime argument vào parameter value

@annotation(annotation)
→ bind annotation instance vào advice parameter

returning = "result"
→ bind return value của invocation thành công

throwing = "throwable"
→ bind exception thoát ra khỏi invocation
```

Ví dụ thực tế trong module:

```text
PointcutMatchingAspect#matchArgs(String value)
TrackingAspect#track(..., TrackExecution trackExecution)
AdviceLifecycleAspect#afterReturning(..., Object result)
AdviceLifecycleAspect#afterThrowing(..., Throwable throwable)
```

Điểm quan trọng là advice có thể nhận đúng dữ liệu mà pointcut/advice declaration đã bind, thay vì mọi advice đều phải tự parse một `Object[]` chung.
