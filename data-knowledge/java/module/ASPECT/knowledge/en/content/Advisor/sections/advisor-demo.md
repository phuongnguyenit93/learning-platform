Controller:

```text
AdvisorController#observeAdvisor()
```

Endpoint:

```text
GET /aop/advanced/advisor/observe
```

The response contains two sub-experiments.

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

`read()` is the baseline proving that a proxy can exist without the Advisor intercepting every method.

### Dynamic `RuntimeArgumentPointcut`

Facts are taken from the real `ClassFilter` and `MethodMatcher`:

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

The `plain` invocation still reaches the target but has no `dynamic-advisor-*` events, proving that the runtime matcher rejected the invocation after the static method match succeeded.
