`java.lang.invoke.MethodHandle` is a neighboring dynamic-invocation mechanism, but it operates at a different abstraction level.

For a learner in the Reflection module, it is enough to treat `MethodHandle` as a **neighboring lower-level API for holding and invoking a dynamically resolved callable target**. Understanding Reflection does not require mastering `MethodType`, `Lookup`, or adaptation; the material below only establishes the boundary between the mechanisms.

Core Reflection focuses on **discovering and manipulating metadata**: find a `Method`, inspect annotations, parameters, modifiers, and generic signatures, then optionally invoke it. A `MethodHandle` represents a callable target with a `MethodType` and supports lookup/adaptation for lower-level dynamic linking and invocation scenarios.

A useful mental model is:

```text
Reflection
→ “what member exists and what metadata describes it?”
→ Method.invoke(...) when a descriptor must be called

MethodHandle
→ “what dynamically selected callable target and type shape do I have?”
→ invokeExact/invoke plus explicit adaptation
```

`invokeExact()` requires the call-site type to match the handle's `MethodType` exactly; `invoke()` is more adaptable. Creating handles still uses `MethodHandles.Lookup` access rules, so MethodHandle is not an encapsulation bypass.

Do not replace every `Method.invoke()` simply because MethodHandle is sometimes associated with optimized dynamic invocation. If the main task is inspecting annotations, generic signatures, or members, reflection remains the natural abstraction. If a runtime system resolves a callable target once and repeatedly invokes it through a controlled type contract, MethodHandle may be a better fit. Its full `java.lang.invoke` model is a separate topic rather than an extension of every reflection example.
