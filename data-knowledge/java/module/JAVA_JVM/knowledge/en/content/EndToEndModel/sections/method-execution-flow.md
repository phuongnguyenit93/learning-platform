When a method is invoked, the executing thread receives a new frame containing local variables, an operand stack, and a runtime-constant-pool reference.

```text
invoke
→ create/push frame
→ bytecode consumes locals/operand stack
→ nested invoke creates another frame
→ return or exception
→ frame is destroyed
```

The execution engine may interpret the method's bytecode or run a compiled native version. Even though those implementation paths differ, observable Java semantics must still satisfy the contract.

The stack-frame model is therefore **logical execution state**; the final CPU registers and machine-stack layout remain implementation details.
