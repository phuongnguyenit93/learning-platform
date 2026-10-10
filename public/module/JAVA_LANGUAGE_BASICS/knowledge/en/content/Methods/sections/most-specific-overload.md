If several candidates are applicable, the compiler tries to choose the **most specific** according to type rules.

```java
void print(Object x) { }
void print(String x) { }

print("java"); // String overload
```

This is a compile-time type decision, not a choice based on source declaration order.

If applicable overloads are unrelated and none is more specific, the call is ambiguous rather than chosen arbitrarily.
