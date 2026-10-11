Deep reflection lets a framework work with private constructors, fields, or methods when the access boundary permits it. Private members, however, are implementation details whose owner normally remains free to change them without maintaining an external caller contract.

If a mapper reads `processedCount` by field name or a framework invokes `internalStatus()`, that code has created an implicit contract:

```text
PaymentService implementation detail
          ↓ private name/signature
reflective consumer depends on it
```

A rename, package refactor, or encapsulation change can break that consumer at runtime. JPMS makes the dependency even more explicit: if the package is not `opens` to the consumer module, deep reflection can be blocked entirely.

When a library or framework needs durable reflective access, define an intentional integration point: a public interface, annotation contract, documented constructor/property convention, or a deliberately opened package. `setAccessible(true)` should not become the default way to compensate for an undefined API contract.
