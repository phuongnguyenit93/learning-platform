Pure functions, referential transparency, immutability as a general design principle, and their language-neutral trade-offs belong to the Functional Programming paradigm module.

For Java Core, the boundary is simpler: **lambda syntax does not guarantee purity or immutability**. A Java lambda may read mutable fields, mutate captured objects, perform I/O, or call impure methods. Conversely, ordinary named Java methods can be pure even when no lambda is involved.

Keep that distinction when reading code. The mechanisms in this module make behavior first-class enough to pass and combine; they do not automatically give that behavior the semantic properties studied by the paradigm module.
