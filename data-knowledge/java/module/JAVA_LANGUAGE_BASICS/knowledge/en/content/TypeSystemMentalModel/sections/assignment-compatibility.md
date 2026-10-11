Java permits assignments only when type/value relationships satisfy language rules.

Subtype-to-supertype assignment is normally implicit; the reverse direction requires a cast and may require a runtime check.

Primitive assignment has a different conversion model from reference assignment.

Static typing prevents many invalid operations before execution, but it cannot prove every runtime cast/reference operation will succeed.

Assignment is a compile-time contract:

```java
Object value = "java";      // reference widening
String text = (String) value; // explicit downcast + runtime check

long n = 10;        // primitive widening
Integer boxed = 10; // boxing
```

Do not use "cast" as a catch-all for every conversion. Widening, narrowing, boxing, unboxing, and reference casts follow different rules and have different runtime implications.

### The same value may convert differently in different contexts

One reason Java conversions can feel inconsistent is that **different contexts permit different sets of conversions**.

| Context | Mental model | Example |
|---|---|---|
| assignment | assignment conversion | `long x = 10;` |
| arithmetic/operator | numeric promotion | `byte + byte -> int` |
| method invocation | invocation conversion | `use(long)` accepts an `int` argument through widening |
| explicit cast | casting conversion | `byte b = (byte) x;` |
| primitive/object boundary | boxing / unboxing | `Integer n = 10; int x = n;` |

A conversion that is legal in one context is **not necessarily inserted automatically** in another.

Constant assignment has a special rule, for example:

```java
byte a = 1; // valid: constant value fits byte

void use(byte value) { }
// use(1);   // invalid: method invocation does not apply that narrowing constant conversion
use((byte) 1);
```

Operators have their own promotion rules:

```java
byte x = 1;
byte y = 2;
// byte z = x + y; // x + y has type int
int z = x + y;
```

When two nearly identical lines behave differently, first ask: **is this assignment, an operator expression, method invocation, or an explicit-cast context?**
