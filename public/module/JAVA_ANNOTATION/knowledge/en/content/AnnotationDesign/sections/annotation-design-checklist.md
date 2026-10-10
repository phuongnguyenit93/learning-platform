Before defining or adopting an annotation, ask:

```text
1. What does the annotation describe?
2. Why should this information live next to source code?
3. Who consumes it?
4. Does the consumer run at compile time or runtime?
5. Where is the annotation legal?
6. How long must the metadata survive?
7. Does it need repetition or class-inheritance lookup?
8. Will the consumer validate, generate, register, or create behavior?
9. Would an explicit API, interface, object, or configuration be clearer?
10. Can a developer reading the code discover the relevant contract and behavior?
```

With those questions answered, `@Something` becomes a complete design model rather than unexplained syntax:

```text
Annotation
→ structured metadata
→ has a schema
→ has a use-site contract
→ has a lifetime
→ has a consumer
→ the consumer creates the effect
```

For deeper runtime inspection mechanics, the `reflection` module owns the detailed Reflection model. The Annotation module ends at annotation contracts, annotation design, and how consumers interact with that metadata.
