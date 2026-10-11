Annotations fit information that:

- naturally belongs to a class, method, field, parameter, or type;
- is relatively stable;
- is declarative rather than algorithmic;
- needs to be consumed by a compiler, tool, or framework;
- benefits from staying close to the code it describes during refactoring.

Examples include:

```text
this method is a test
this class maps to a data model
this field has a validation rule
this method should be audited
this API is deprecated
```

The common question is:

```text
"What is special about this program element?"
```

rather than a step-by-step description of which algorithm must run.

Annotations are especially useful when the consumer is explicit:

```text
metadata
   ↓
consumer understands the contract
   ↓
consumer validates / generates / registers / creates behavior
```

If you cannot identify **who reads the annotation** and **what that consumer does with it**, the annotation is likely to become a label without a clear contract.
