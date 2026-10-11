In arithmetic expressions, `byte`, `short`, and `char` are commonly promoted to `int`:

```java
byte a = 1;
byte b = 2;
int c = a + b;
```

Reason about the type of the **whole expression**, not only the operand types.

### Arithmetic semantics depend on operand types

```java
int a = 5 / 2;       // 2
double b = 5 / 2;    // 2.0: integer division happened first
double c = 5 / 2.0;  // 2.5
```

Compound assignment has special conversion behavior:

```java
byte b = 1;
// b = b + 1; // does not compile: b + 1 is int
b += 1;        // compiles
```

So `x += y` is not always equivalent to mechanically expanding it as `x = x + y`.
