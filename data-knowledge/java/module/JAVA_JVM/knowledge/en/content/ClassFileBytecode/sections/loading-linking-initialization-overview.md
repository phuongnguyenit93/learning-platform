Before a class/interface participates fully in execution, the JVM model distinguishes three major lifecycle ideas:

```text
Loading
→ obtain a binary representation and create a runtime class/interface

Linking
→ verification + preparation + possibly resolution

Initialization
→ execute the class/interface initialization method <clinit>
```

Loading asks whether the runtime has created the type representation. Linking asks whether that representation has been validated and integrated into JVM runtime state. Initialization applies the type's static initialization semantics.

This module teaches the lifecycle and failure boundary only. ClassLoader APIs, delegation, and loader identity belong to the Class Loading module.
