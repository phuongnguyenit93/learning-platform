### WHAT — when does an abstraction leak?

An abstraction leaks when callers must understand implementation details to use the contract correctly.

Consider an apparently simple API:

```java
interface ReportStore {
    void save(Report report);
}
```

If callers must secretly know that implementation A rejects certain file names, implementation B requires an extra `flush()` call, and implementation C has an undocumented size limit, then the abstraction has leaked details that are necessary for correct use.

Examples:

- an API says “save”, but callers must know the concrete provider to handle errors correctly;
- a collection hides storage, but performance changes dramatically by implementation;
- a resource abstraction hides lifecycle so thoroughly that callers do not know they must close it;
- ordering or thread-safety assumptions are omitted even though they affect correctness.

### WHY — no abstraction can hide everything

The goal is not to hide every detail. Constraints that materially affect correctness or an important performance contract should be exposed or documented. Irrelevant implementation details should remain hidden.

### DISTINCTION — abstraction, encapsulation, and information hiding

These ideas reinforce each other but emphasize different questions:

```text
Abstraction
→ choose the minimal model/contract the caller needs to reason about

Encapsulation
→ place state + behavior behind a controlled boundary

Information hiding
→ hide change-prone design decisions so callers do not depend on them unnecessarily
```

In real code they often work together, but separating them prevents the false conclusion that `private` or `interface` automatically produces a good abstraction.
