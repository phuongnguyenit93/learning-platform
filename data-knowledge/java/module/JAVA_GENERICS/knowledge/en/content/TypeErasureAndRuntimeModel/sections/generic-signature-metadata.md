Type erasure does not mean **every trace of generics disappears from the class file**.

For example, a field may be declared as:

```java
List<String> names;
```

Executable bytecode primarily works with the erased `List` type, while the class file can also retain a generic signature describing `List<String>` for compilers, Reflection, and tooling.

Keep these layers distinct:

```text
runtime execution type
→ primarily the erased type

generic signature metadata
→ describes declaration type parameters / type arguments
→ may remain in the class file
```

Reflection exposes abstractions such as `ParameterizedType`, `TypeVariable`, and `WildcardType` for reading this metadata. Reflection mechanics belong to the Reflection module; the key model here is that **erased execution and retained generic metadata can coexist**.
