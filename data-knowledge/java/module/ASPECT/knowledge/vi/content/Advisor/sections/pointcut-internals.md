Ở Spring AOP API thấp hơn, `Pointcut` không chỉ là một expression string. Mental model cốt lõi là:

```text
Pointcut
├── ClassFilter
│     └── target class này có phải candidate không?
│
└── MethodMatcher
      └── method này có match không?
```

`ClassFilter` loại sớm những type không liên quan. `MethodMatcher` quyết định method nào trên candidate type được chọn.

Experiment static đầu tiên dùng:

```text
NameMatchMethodPointcut
```

và chỉ map method:

```text
write
```

Target có:

```text
read()
write()
```

Vì vậy cùng một proxy nhưng chỉ `write()` đi qua advice:

```text
read()
→ pointcut false
→ target

write()
→ pointcut true
→ advice
→ target
```

Response đọc trực tiếp:

```text
NameMatchMethodPointcut#getMethodMatcher().isRuntime()
```

và cho kết quả `false`.
