Dynamic Runtime in this module means the low-level `java.lang.invoke` mechanisms that let Java represent invocation or variable access as typed runtime values, then link, adapt, or select behavior dynamically. The goal is not to make ordinary application code “dynamic”; it is to understand primitives used by the JVM, frameworks, and language runtimes when a direct Java call is not flexible enough.

The module has two main branches:

```text
typed invocation
MethodType + MethodHandle + Lookup
        ↓
adaptation / composition
        ↓
CallSite + invokedynamic

typed variable access
VarHandle
```

`MethodHandle` and `VarHandle` receive special JVM treatment through signature-polymorphic methods, so the actual call-site descriptor can carry the runtime contract instead of being limited by the apparent Java declaration.

The module follows this learning path:

```text
MethodType + MethodHandle
→ Lookup
→ adaptation / composition
→ CallSite
→ invokedynamic
→ VarHandle
→ synthesis / decision model
```

The invocation/linkage branch comes first so its mental model is complete before VarHandle opens the parallel variable-access branch. By the end, the learner should distinguish **type contracts**, **access capabilities**, **linkage objects**, and **variable-access semantics**, rather than merely memorizing API names.

One important correction to a common mental model: **dynamic does not simply mean “the member is unknown until runtime.”** A member may already be known while a runtime still benefits from a typed executable handle, transferable lookup capability, composable adapters, or a call site whose target can change.
