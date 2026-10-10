The local-variable array provides indexed slots for parameters and local method state. The operand stack is the working stack on which many JVM instructions consume inputs and produce results.

```text
iload_1   local[1] → operand stack
iload_2   local[2] → operand stack
iadd      pop two ints, push result
ireturn   pop result and return
```

After JIT optimization, a source-level value may not map one-to-one to a physical variable or register. But at the class-file/JVMS level, local variables and the operand stack are the core execution model.

That is why `javap -c` is useful for learning: you can follow value flow without needing to know the CPU's final register allocation.
