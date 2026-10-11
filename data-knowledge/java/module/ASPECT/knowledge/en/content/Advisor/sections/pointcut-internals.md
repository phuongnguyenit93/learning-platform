At the lower Spring AOP API level, a `Pointcut` is not just an expression string. The core mental model is:

```text
Pointcut
├── ClassFilter
│     └── is this target class a candidate?
│
└── MethodMatcher
      └── does this method match?
```

`ClassFilter` eliminates unrelated types early. `MethodMatcher` decides which methods on candidate types are selected.

The first static experiment uses:

```text
NameMatchMethodPointcut
```

and maps only the method:

```text
write
```

The target has:

```text
read()
write()
```

Therefore only `write()` passes through advice even though both calls use the same proxy:

```text
read()
→ pointcut false
→ target

write()
→ pointcut true
→ advice
→ target
```

The response directly reads:

```text
NameMatchMethodPointcut#getMethodMatcher().isRuntime()
```

and gets `false`.
