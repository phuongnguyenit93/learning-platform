`Advisor` làm rõ architecture nền:

```text
Pointcut
  ├── ClassFilter
  └── MethodMatcher
+
Advice / MethodInterceptor
```

`MethodMatcher` có thể chỉ dựa trên static metadata hoặc yêu cầu thêm runtime arguments. `@AspectJ` style giúp authoring dễ hơn, nhưng Spring AOP infrastructure vẫn có các abstraction thấp hơn để biểu diễn cùng selection rule đó.
