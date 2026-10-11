```java
static <T extends Number> double twice(T value) {
    return value.doubleValue() * 2;
}
```

`T extends Number` means the type argument must be `Number` or one of its subtypes.

```java
twice(10);      // Integer
twice(2.5);     // Double
// twice("10"); // compile error
```

The keyword is still `extends` when the bound is an interface:

```java
static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}
```

A bound simultaneously restricts callers and gives the implementation safe capabilities.

Type-parameter declarations support **upper bounds** with `extends`:

```java
<T extends Number> // legal
// <T super Integer> // illegal
```

When an API needs to describe “some supertype of Integer,” Java uses a **lower-bounded wildcard** such as `? super Integer` at the use site; the Wildcards chapter covers that mechanism.
