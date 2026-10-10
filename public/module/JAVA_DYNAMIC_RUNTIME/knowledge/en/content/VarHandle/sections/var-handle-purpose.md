`VarHandle` is a **dynamically strongly typed reference** to a variable or parametrically defined family of variables. It provides one abstraction for multiple kinds of variable access while exposing explicit access semantics.

The referenced variable may be:

- a static field;
- an instance field;
- an array element;
- a component viewed through a `byte[]` or `ByteBuffer`;
- a variable accessed by another API that consumes VarHandle, including some foreign-memory use cases.

VarHandles are immutable and have no visible mutable state.

```text
MethodHandle
→ executable operation

VarHandle
→ variable location/family
   + access-mode semantics
```
