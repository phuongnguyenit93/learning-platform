# Generic Limitations and API Design

This chapter is primarily a **deeper second-pass topic**, not syntax you must memorize for everyday use. Beginners should know these restrictions exist and understand their common cause; they do not need every edge case memorized before using generics.

After learning `T`, wildcards, and erasure, several questions usually appear:

```java
// List<int> numbers;             // why not?
// T value = new T();             // why not?
// T[] values = new T[10];        // why not?
// Object value; value instanceof List<String> // why not?
```

If each line is learned as an isolated prohibition, generics quickly becomes a list of rules to memorize.

This chapter groups those restrictions by **cause**.

Many restrictions can be understood from the interaction of these facts, but not every language rule has exactly the same cause:

```text
generics are checked mainly at compile time
        +
type erasure removes part of generic type identity at runtime
        +
some JVM mechanisms require concrete runtime type information
```

Once those ideas are connected, restrictions around primitive type arguments, `new T()`, generic arrays, and several runtime checks become easier to reason about. Other rules, such as static type-parameter scope or `Throwable` restrictions, also depend on Java's language and type-model rules rather than erasure alone.
