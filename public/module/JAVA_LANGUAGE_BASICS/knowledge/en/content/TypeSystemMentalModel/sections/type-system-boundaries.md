The compiler can check name/type resolution, assignment compatibility, overload applicability, definite assignment, and many access/cast constraints.

Runtime still handles facts the compiler cannot know with certainty, such as actual downcast type, runtime array component type, null dereference, or array index bounds.

That is why static type checking coexists with runtime exceptions such as `ClassCastException`, `ArrayStoreException`, and `NullPointerException`.

| Situation | Compile time | Runtime still decides/checks |
|---|---|---|
| local variable | definite assignment | concrete value |
| overload | applicability + most-specific | overload is not selected again |
| override | selected signature | receiver type dispatches body |
| downcast | legal type relationship | actual object compatibility |
| array store | static assignment compatibility | runtime component type |
| array index | integer-compatible expression | bounds |
| dereference | member exists on static type | reference is non-null |

The final chapter uses these boundaries to connect all Language Basics concepts into one end-to-end reasoning model.
