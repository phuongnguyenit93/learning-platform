Keep these two operations separate:

```text
invokedynamic linkage
→ instruction is resolved/linked to one CallSite
→ it does not repeatedly switch to different CallSite objects

CallSite target update
→ MutableCallSite / VolatileCallSite can change the MethodHandle target
→ the dynamic invoker dispatches to the current target
```

So “invokedynamic relinks every time the target changes” is the wrong model.

```text
instruction
   │  link once
   ↓
CallSite
   │  target may change
   ↓
MethodHandle target
```

This distinction is essential before learning the bootstrap lifecycle in the next chapter.
