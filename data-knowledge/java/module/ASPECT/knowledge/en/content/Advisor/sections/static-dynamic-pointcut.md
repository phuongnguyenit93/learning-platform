Static matching only needs method metadata and the target class:

```text
matches(Method, targetClass)
```

If:

```text
MethodMatcher#isRuntime() == false
```

the framework does not need runtime arguments to decide whether each invocation matches.

Dynamic matching adds another step:

```text
static phase
matches(Method, targetClass)
        ↓ true
runtime phase
matches(Method, targetClass, args...)
```

The module defines:

```text
RuntimeArgumentPointcut
```

with this rule:

```text
ClassFilter
→ AdvisorTarget

static MethodMatcher
→ method name = writeWithMode

runtime MethodMatcher
→ first argument = "audit"
```

Two invocations call the same method:

```text
writeWithMode("audit")
→ static match true
→ runtime match true
→ advice runs

writeWithMode("plain")
→ static match true
→ runtime match false
→ target runs but advice does not
```

A dynamic pointcut is useful when selection truly depends on runtime data, but it requires runtime evaluation. If selection depends only on type/method metadata, static matching is simpler.
