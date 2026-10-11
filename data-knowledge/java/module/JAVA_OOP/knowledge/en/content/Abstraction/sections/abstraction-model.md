### WHAT — what is abstraction?

An abstraction is a model or contract that exposes only the concepts and behavior a caller needs while keeping unrelated implementation details behind a boundary.

For checkout, a caller may need only:

```java
interface Pricing {
    int price(int base);
}
```

The caller does not need to know whether an implementation calculates discounts from a rule table, a database, or a formula if those details are outside the contract.

### RELATION — abstraction and encapsulation

The concepts complement each other:

```text
Abstraction
→ decide what the caller needs to see

Encapsulation
→ control what the caller must not freely access or mutate
```

An API may hide fields with `private` while still exposing a poor abstraction through too many low-level operations. Conversely, a very small contract may still leak implementation details through undocumented errors or performance behavior.

### HOW — abstraction is not the `abstract` keyword

Interfaces and abstract classes are common Java mechanisms for expressing abstractions, but a concrete class or function can also form a good abstraction when its contract is clear.

### CONTRACT — an abstraction is more than a method list

A useful abstraction often needs to define more than method names. Depending on the domain, the contract may include:

```text
provided behavior
+
valid inputs / preconditions
+
results / postconditions
+
failure semantics
+
side effects
+
lifecycle or ordering constraints when they affect correctness
```

For example:

```java
interface Storage {
    void save(Data data);
}
```

does not by itself tell callers how `save` can fail, whether it is idempotent, or whether transaction/lifecycle rules matter. Details that affect **correct usage** belong in the contract; they should not disappear merely because an interface hides the implementation.

The `abstract-interface` module goes deeper into choosing interfaces vs abstract classes. Here the focus is the **design role**, not the keyword.
