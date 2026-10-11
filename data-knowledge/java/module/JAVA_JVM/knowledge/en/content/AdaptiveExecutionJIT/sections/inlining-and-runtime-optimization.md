Inlining replaces a call boundary with the callee's body in the compiled representation when the optimizer decides it is profitable and safe.

```text
before
caller → call smallMethod()

after conceptual inlining
caller → [body of smallMethod]
```

The benefit is larger than call-overhead removal. Inlining exposes more code to constant propagation, dead-code elimination, escape analysis, and other cross-boundary optimizations.

Inlining is not part of Java source semantics. The runtime may inline or decline to inline based on profile, size, policy, and current compilation state.

Treat claims such as “this method will definitely inline” as implementation hypotheses unless measurement confirms them.
