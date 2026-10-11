The compiler must prove a local variable is assigned before it is read:

```java
int x;
// System.out.println(x); // invalid: x is not assigned
x = 1;
System.out.println(x);  // valid
```

This is a **compile-time guarantee**, not field-style runtime default initialization. Once branches and loops are introduced, the compiler reasons across all possible execution paths; that path-sensitive case is revisited in Control Flow.

Next we establish the null-reference model before moving to wrapper types and unboxing.
