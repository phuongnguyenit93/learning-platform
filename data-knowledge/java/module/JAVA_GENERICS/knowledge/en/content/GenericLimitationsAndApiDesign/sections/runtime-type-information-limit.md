Erasure limits which questions runtime can answer directly about `T` or a concrete generic type argument.

A type parameter cannot be used as a class literal:

```java
static <T> void inspect() {
    // Class<?> type = T.class; // compile error
}
```

With a very broad reference, runtime also cannot arbitrarily verify a concrete generic argument:

```java
Object value = new ArrayList<String>();
// value instanceof List<String> // compile error
```

Likewise, `instanceof T` is not available because `T` does not represent an independent runtime class identity after erasure:

```java
// if (value instanceof T) { } // compile error
```

But since Java 16, some parameterized `instanceof` checks are legal when the static type permits a checked cast, such as `List<Integer> → ArrayList<Integer>`. The real restriction is not “all parameterized types are forbidden with instanceof”; it is that runtime **cannot independently verify arbitrary erased concrete type arguments**.

When generic code genuinely needs a runtime type token, an API usually receives one from the caller, such as `Class<T>`, rather than trying to recover it from `T` alone.
