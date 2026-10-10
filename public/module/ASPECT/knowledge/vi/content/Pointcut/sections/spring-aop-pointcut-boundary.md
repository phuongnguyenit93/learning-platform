Spring AOP dùng **AspectJ pointcut expression language**, nhưng runtime model vẫn là proxy-based method interception.

Vì vậy không nên suy luận:

```text
Spring hiểu AspectJ pointcut syntax
→ Spring AOP hỗ trợ mọi AspectJ join point
```

Các designator gắn với join point ngoài proxy method execution, ví dụ:

```text
call(...)
get(...)
set(...)
initialization(...)
cflow(...)
cflowbelow(...)
```

không thuộc capability thông thường của proxy-based Spring AOP.

Mental model đúng:

```text
AspectJ expression syntax
        ≠
full AspectJ weaving model
```

Chapter `15.RuntimeBoundary` sẽ nối distinction này với full AspectJ weaving.
