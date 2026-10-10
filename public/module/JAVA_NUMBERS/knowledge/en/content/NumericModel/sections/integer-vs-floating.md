Integer and floating-point arithmetic fail in different ways:

```text
integer
→ exact inside the representable range
→ overflow/wraparound beyond it

floating-point
→ wide dynamic range
→ many values are approximations
→ NaN / infinity / signed zero are part of the model
```

```java
int count = Integer.MAX_VALUE;
count++;
System.out.println(count); // Integer.MIN_VALUE

double total = 0.1 + 0.2;
System.out.println(total); // 0.30000000000000004
```

The first result comes from a finite integer range. The second comes from finite binary representation. The important question is not which family is universally "more accurate", but which semantics fit the problem.
