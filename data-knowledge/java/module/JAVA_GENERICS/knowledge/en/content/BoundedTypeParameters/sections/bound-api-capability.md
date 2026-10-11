Without a bound:

```java
static <T> double area(T value) {
    // value.doubleValue(); // compiler cannot assume this method exists
    return 0;
}
```

With a bound:

```java
static <T extends Number> double asDouble(T value) {
    return value.doubleValue();
}
```

The compiler permits members guaranteed by the bound.

```text
bound
→ restricts the legal type-argument set
→ gives the implementation a stronger contract in return
```

Do not add bounds only to make an API appear stricter. An unnecessarily specific bound reduces reuse. Require only the capability the algorithm genuinely needs.

Bounds constrain a **named type variable**. Before moving to wildcards, one generic rule must be clear: subtype relationships between type arguments do **not** automatically transfer through a generic type. The next chapter explains invariance and why `List<Dog>` is not automatically a `List<Animal>`.
