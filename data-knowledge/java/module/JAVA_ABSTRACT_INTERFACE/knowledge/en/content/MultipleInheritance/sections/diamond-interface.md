A diamond shape is not automatically ambiguous.

If several inheritance paths ultimately lead to one **most-specific** default method, the contract remains unambiguous. A conflict appears only when independent defaults compete and no candidate is more specific.

The milestone mental model is:

```text
multiple interface inheritance
→ combines types/contracts
→ may also inherit default behavior
→ interfaces contribute no per-instance state; this is not multiple class inheritance
→ competing defaults are resolved by specificity + class-hierarchy precedence + explicit override
```

With conflict rules established, the final milestone connects the whole module into one design model: which mechanism to choose, how to combine them, and what to inspect once interface hierarchies and default behavior enter the design.
