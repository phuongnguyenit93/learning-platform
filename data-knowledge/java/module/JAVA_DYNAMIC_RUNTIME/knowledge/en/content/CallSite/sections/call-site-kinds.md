The three concrete forms have different target behavior:

| Type | Target | Visibility model |
| --- | --- | --- |
| `ConstantCallSite` | Never changes | Permanent target |
| `MutableCallSite` | Can change | Update behaves like an ordinary field; other threads may not immediately observe it |
| `VolatileCallSite` | Can change | Reads/writes have volatile-like semantics |

`ConstantCallSite` is appropriate when bootstrap resolves a target once:

```java
return new ConstantCallSite(target);
```

`MutableCallSite` fits optimization runtimes where a target may be updated and visibility is managed explicitly.

`VolatileCallSite` is simpler when target updates need volatile-style visibility, at the cost of stronger synchronization semantics.

Choose based on **whether the target changes and what visibility guarantee is required**, not merely on the class name.
