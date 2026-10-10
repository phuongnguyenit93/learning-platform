```java
String canonical = value.intern();
```

The runtime returns the pool reference associated with the same String content.

Contract mental model:

```text
value.intern()
        │
        ├── pool already has String equals(value)
        │      → return existing canonical reference
        │
        └── not present
               → value becomes the canonical representative
               → return canonical reference
```

This does not mutate `value` and does not change String equality semantics. Interning is about **identity/canonicalization**, not a different definition of text equality.

### WHY use intern?

Interning lets an application request canonical identity for equal String values. It can help selected workloads with highly repeated values and controlled cardinality.

If the only question is “do these strings have the same content?”, `equals` already answers it; interning first is unnecessary.
