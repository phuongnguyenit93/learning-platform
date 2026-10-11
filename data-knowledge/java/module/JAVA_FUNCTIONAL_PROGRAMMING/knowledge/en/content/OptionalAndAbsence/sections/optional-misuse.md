Common problems come from treating `Optional` as ceremony rather than an absence model.

- Returning `null` from a method declared as `Optional<T>` creates two absence representations.
- Calling `get()` without proving presence can throw `NoSuchElementException` and usually hides the intended fallback or failure rule.
- Wrapping a value in `Optional` only to immediately unwrap it adds noise without improving the contract.
- Using `Optional` for every field, parameter, and collection can spread wrapper handling through code without clarifying domain semantics.
- Putting side effects inside `map` makes a transformation unexpectedly stateful; use a terminal action or explicit boundary when an effect is the real goal.

Use `Optional` where the type should make possible absence explicit in the API contract. It makes absence visible to callers, but it does not force a particular handling strategy. Elsewhere, choose the representation that communicates the domain most directly.
