A type parameter may need to satisfy several contracts:

```java
static <T extends Number & Comparable<T>> T larger(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}
```

If a class bound is present, it must come first, and there can be at most one class:

```java
<T extends SomeClass & InterfaceA & InterfaceB>
```

This is illegal:

```java
// <T extends InterfaceA & SomeClass> ...
```

Bound order also has a later compiler/runtime consequence. The **Type Erasure** chapter explains precisely why the first bound matters; for now, keep the declaration rule: when a class bound exists, it must precede the interface bounds.
