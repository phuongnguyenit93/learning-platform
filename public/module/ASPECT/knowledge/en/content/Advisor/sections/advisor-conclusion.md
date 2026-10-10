`Advisor` makes the underlying architecture explicit:

```text
Pointcut
  ├── ClassFilter
  └── MethodMatcher
+
Advice / MethodInterceptor
```

`MethodMatcher` can rely only on static metadata or require runtime arguments as well. `@AspectJ` style makes authoring easier, but Spring AOP infrastructure still has lower-level abstractions that represent the same selection rules.
