A compile-time String constant expression produces an interned constant String, so it can share the canonical reference of the corresponding literal:

```java
String a = "ja" + "va";
String b = "java";
```

Runtime concatenation does not carry the same identity guarantee.

The exact rules for **constant expressions**, `final` variables, and compile-time concatenation belong to the Concatenation chapter. The pool-level mental model is only that identity depends on how the value is produced; content comparison still uses `equals`.

### Practical rule

```text
same object?
→ ==

same text?
→ equals

need a canonical pooled reference deliberately?
→ intern(), with explicit trade-offs
```

Application logic should never depend on pool identity for text equality. The pool is a canonical-reuse mechanism; for literals and constant String expressions, interning is part of Java's specified semantics rather than merely an optional runtime optimization.

The next chapter focuses directly on String comparison rules.
