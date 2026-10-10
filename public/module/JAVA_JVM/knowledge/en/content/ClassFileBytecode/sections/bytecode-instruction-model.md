Bytecode is the JVM instruction set. Each instruction has an opcode and may carry operands. Instructions commonly operate on local variables, the operand stack, objects/arrays, or symbolic references in the runtime constant pool.

For example:

```java
int add(int a, int b) {
    return a + b;
}
```

can conceptually compile to:

```text
iload_1
iload_2
iadd
ireturn
```

The important lesson is not memorizing opcodes. It is understanding the **stack-oriented execution model**: instructions consume and produce values on the operand stack while reading/writing local slots and runtime data.
