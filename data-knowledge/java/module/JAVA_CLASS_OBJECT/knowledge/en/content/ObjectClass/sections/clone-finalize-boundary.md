`Cloneable`/`Object.clone()` has awkward semantics for deep object graphs, constructors, and invariants. Prefer explicit copy constructors, factories, or mapping when possible.

Finalization is not a reliable resource-management mechanism. Prefer `AutoCloseable`/try-with-resources or other explicit cleanup designs.

The next chapter looks at a special class form: `enum`.
