Before separating `Field`, `Method`, and `Constructor`, it helps to see that they are not three unrelated API families. Core Reflection exposes shared abstractions that let framework code reason about members at a higher level:

| Abstraction | Role |
| --- | --- |
| `Member` | Common contract for `Field`, `Method`, and `Constructor`: name, declaring class, modifiers, synthetic state |
| `Executable` | Shared base of `Method` and `Constructor`: parameters, exceptions, varargs, generic declarations |
| `AccessibleObject` | Shared base for `Field`, `Method`, and `Constructor` reflective access checks |
| `AnnotatedElement` | Runtime annotation lookup contract implemented by `AccessibleObject` and many other program elements |

~~~text
                 Member
             ┌─────┴──────┐
           Field       Executable
                         ├─ Method
                         └─ Constructor

Field ───────────────┐
Executable ──────────┴─→ AccessibleObject → AnnotatedElement
~~~

This is a learning-oriented view rather than the entire `java.lang.reflect` hierarchy. For example, `Executable` also implements `GenericDeclaration`; `Class<?>` implements `AnnotatedElement` but is not a `Member`.

A practical flow is:

~~~text
discovery
→ obtain a descriptor
→ inspect shared metadata
→ check access
→ perform the Field / Method / Constructor-specific operation
~~~

The next three chapters can therefore focus on behavior specific to each member kind without relearning modifiers, annotations, or the access abstraction from scratch.
