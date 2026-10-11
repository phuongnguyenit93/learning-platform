Move to the Stream API module once the remaining question is about **how Stream processing behaves**, rather than **how Java represents the behavior passed into it**.

Stay in this module when you are asking questions such as:

- Why does this parameter have type `Predicate<T>` or `Function<T, R>`?
- Why is this lambda compatible with one method call but not another?
- Can this method reference satisfy the target function type?
- What variable-capture rules apply inside the lambda?

Continue into Stream API when the question is about the Stream's own lifecycle, operation semantics, execution, accumulation, ordering, or parallel behavior.
