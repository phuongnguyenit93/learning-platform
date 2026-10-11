Static matching chỉ cần metadata của method + target class:

```text
matches(Method, targetClass)
```

Nếu:

```text
MethodMatcher#isRuntime() == false
```

thì framework không cần runtime arguments để quyết định match cho từng invocation.

Dynamic matching có thêm bước:

```text
static phase
matches(Method, targetClass)
        ↓ true
runtime phase
matches(Method, targetClass, args...)
```

Module định nghĩa:

```text
RuntimeArgumentPointcut
```

với rule:

```text
ClassFilter
→ AdvisorTarget

static MethodMatcher
→ method name = writeWithMode

runtime MethodMatcher
→ first argument = "audit"
```

Hai invocation cùng gọi một method:

```text
writeWithMode("audit")
→ static match true
→ runtime match true
→ advice chạy

writeWithMode("plain")
→ static match true
→ runtime match false
→ target chạy nhưng advice không chạy
```

Dynamic pointcut hữu ích khi selection thật sự phụ thuộc dữ liệu runtime, nhưng nó cần thêm runtime evaluation. Nếu selection chỉ phụ thuộc type/method metadata thì static matching đơn giản hơn.
