Not every `static final` value is a compile-time constant. Java has specific rules for primitive/String constant expressions.

```java
static final int MAX_DAILY_WITHDRAWALS = 3;          // compile-time constant
static final int CONFIGURED_LIMIT = Integer.parseInt("3"); // not a compile-time constant
```

The first value is a primitive initialized from a constant expression, so client bytecode may inline it. The second requires a method call and is initialized at runtime.

That distinction affects inlining and binary behavior when libraries change constants without client recompilation.

`UPPER_SNAKE_CASE` is a naming convention; the semantic contract matters more than the style.

The next chapter looks at initialization blocks outside constructor bodies.
