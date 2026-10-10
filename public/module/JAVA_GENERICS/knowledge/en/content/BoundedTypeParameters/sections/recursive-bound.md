This is an **advanced section**. On a first pass, it is enough to understand that a bound can describe a relationship between `T` and a generic capability involving that same `T`; you do not need to design complex F-bounds yet.

A bound can refer back to the type parameter:

```java
<T extends Comparable<T>>
```

This says that `T` must be comparable to `T`.

```java
static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}
```

This is often described as a recursive bound or F-bounded style. It does not create runtime recursion; it describes a **type constraint**.

Some APIs use a more flexible form such as `Comparable<? super T>` when the comparison capability may be declared on a supertype. Wildcards and PECS explain that direction later.
