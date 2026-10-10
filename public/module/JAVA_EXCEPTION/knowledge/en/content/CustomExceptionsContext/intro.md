# Designing Custom Exceptions

Not every failure needs a new exception class. A custom exception is valuable when the new type **adds meaning**, creates a useful abstraction boundary, or gives callers a meaningful handling category.

The question is not:

```text
"Can we create our own exception?"
```

It is:

```text
"What does the caller gain from this separate type?"
```
