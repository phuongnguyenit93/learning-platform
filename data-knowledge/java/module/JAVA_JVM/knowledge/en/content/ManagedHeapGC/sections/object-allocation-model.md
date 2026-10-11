At specification level, objects and arrays receive storage from the heap. Source code such as:

```java
Order order = new Order();
```

supports this conceptual model:

```text
new instruction
→ ensure the class is ready according to lifecycle rules
→ allocate storage for an uninitialized object
→ place the object reference into the operand-stack flow
→ invokespecial calls constructor <init>
→ constructor execution completes initialization
```

At bytecode level, `new` and constructor invocation are **separate steps**. `new` creates an uninitialized object; compilers commonly emit `dup` followed by `invokespecial ... <init>` to invoke the constructor. That distinction matters when reading bytecode and understanding verifier rules.

HotSpot may use fast allocation techniques such as bump-pointer allocation or thread-local allocation buffers depending on collector/layout. Those are implementation details, not JVM contract.

Do not teach “every Java object is allocated through a TLAB” as a portable rule.
