Controller:

```text
AdvisorController#observeAdvisor()
```

Endpoint:

```text
GET /aop/advanced/advisor/observe
```

Response có hai experiment con.

### Static `NameMatchMethodPointcut`

Fact:

```text
staticNameMatchPointcut.methodMatcherIsRuntime = false
```

Events:

```text
target:read
advisor-before:write
target:write
advisor-after:write
```

`read()` là baseline chứng minh proxy tồn tại nhưng Advisor không bắt buộc intercept mọi method.

### Dynamic `RuntimeArgumentPointcut`

Facts được lấy từ chính `ClassFilter` và `MethodMatcher`:

```text
classFilterMatchesAdvisorTarget = true
staticMethodMatch              = true
methodMatcherIsRuntime         = true
runtimeMatchAudit              = true
runtimeMatchPlain              = false
```

Events:

```text
dynamic-advisor-before:writeWithMode:mode=audit
target:writeWithMode:mode=audit
dynamic-advisor-after:writeWithMode:mode=audit
target:writeWithMode:mode=plain
```

Invocation `plain` vẫn tới target nhưng không có `dynamic-advisor-*`, chứng minh runtime matcher đã từ chối invocation sau khi static method match thành công.
