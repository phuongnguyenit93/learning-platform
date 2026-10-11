This is an **advanced section**. On a first pass, the required concepts are `?`, `? extends`, `? super`, and PECS. Wildcard capture matters mainly when the compiler rejects an operation even though an unknown type must remain internally consistent.

Sometimes the compiler needs to give the unknown wildcard type a temporary internal identity.

Public API:

```java
static void swapFirstTwo(List<?> values) {
    swapHelper(values);
}
```

Generic helper:

```java
private static <T> void swapHelper(List<T> values) {
    T first = values.get(0);
    values.set(0, values.get(1));
    values.set(1, first);
}
```

`List<?>` does not mean “a list of arbitrary `Object` values.” It has one concrete element type that is simply **unknown**. Capture gives that hidden type a consistent temporary variable so type-safe reads and writes can be related.

Useful design rule:

- use a wildcard when exact type identity does not need to be named;
- use a named type parameter when several parameters or a return type must share the same identity.

Wildcards + PECS now complete the use-site flexibility story. The next chapter moves to Java's legacy-compatibility boundary: **raw types**.
