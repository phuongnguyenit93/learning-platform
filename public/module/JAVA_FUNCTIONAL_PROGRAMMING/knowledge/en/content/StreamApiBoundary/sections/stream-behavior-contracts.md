Different Stream methods ask for different behavior contracts. You can often understand what a method expects by reading the functional-interface type in its signature.

- `Predicate<T>` answers a yes/no question about a value.
- `Function<T, R>` transforms one value into another form.
- `Consumer<T>` performs an action without returning a result through the functional contract.
- `Supplier<T>` can provide values when an API needs a value-producing behavior.

These interfaces are not Stream-specific. They are general Java contracts reused by the Stream API, collections utilities, asynchronous APIs, application code, and many libraries.

When learning this chapter, focus on recognizing the contract. Detailed Stream operation categories and execution rules belong in the Stream API module.
