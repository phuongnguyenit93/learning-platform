A local variable, method parameter, or exception parameter captured by a lambda must be `final` or **effectively final**.

An effectively-final variable is not declared with `final`, but its value is assigned once and never reassigned afterward:

```java
int minimum = 3;
Predicate<String> longEnough = text -> text.length() >= minimum;
```

This compiles because `minimum` is never reassigned.

```java
int minimum = 3;
minimum = 5;

// Does not compile because minimum is not effectively final.
Predicate<String> longEnough = text -> text.length() >= minimum;
```

The rule applies to the local **binding**, not to every object reachable through it. Declaring a reference final or effectively final prevents the variable from pointing somewhere else; it does not make the referenced object immutable.

If behavior needs state that changes over time, model that state explicitly rather than trying to work around the capture rule with mutable single-element arrays or similar tricks.
