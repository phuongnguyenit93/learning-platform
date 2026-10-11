For a captured local variable, the lambda retains the **value of the local binding** needed by the behavior.

For primitives, that value is the primitive value:

```java
int offset = 10;
IntUnaryOperator addOffset = value -> value + offset;
```

For reference variables, the captured value is the object reference:

```java
String prefix = "ID-";
Function<Integer, String> formatter = value -> prefix + value;
```

The lambda does not gain a magic live link to a mutable local slot that can later be reassigned. Java's effectively-final rule prevents such reassignment for captured locals.

This distinction also explains why a captured reference can point to a mutable object: the **reference value** stays fixed even though the object it points to may change.
