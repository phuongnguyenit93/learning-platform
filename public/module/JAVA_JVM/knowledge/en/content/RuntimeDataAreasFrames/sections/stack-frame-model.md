A frame is the execution context for **one method invocation**. The JVMS model gives each frame three major components:

```text
Frame
├─ local variables
├─ operand stack
└─ reference to the current class's runtime constant pool
```

A frame also participates in dynamic linking, method return, and exception dispatch.

The required local-variable and operand-stack sizes are known from class-file method metadata, allowing the runtime to create an appropriate frame for an invocation.

This matters because JVM bytecode primarily manipulates local slots and the operand stack, not source-language variables directly.
