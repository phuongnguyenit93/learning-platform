The pool provides canonical references for selected Strings, especially literals and explicitly interned values.

### WHY — why have a pool?

Strings appear everywhere in source code: class names, keys, messages, paths, tokens, and constants. If every identical literal required a separate object, the runtime could retain many identities with no additional semantic value.

String immutability makes canonical sharing safe:

```text
equal immutable String values
        ↓
safe shared canonical identity
        ↓
String pool
```

```java
String a = "java";
String b = "java";
```

Because equal String literals are interned, these two literals refer to the same canonical pooled String object.

For String literals, sharing is not merely an accidental optimization: literals and constant String expressions participate in interning semantics. Where a particular JVM stores its pool is an implementation detail; do not tie the concept to an old PermGen-era memory story.

Pooling is an **identity optimization/canonicalization mechanism**. It does not change the rule that text content should be compared with `equals`.

The pool is also not a public `Map` that application code can iterate, remove from, or mutate. Treat it as a mental model for canonical identity.
