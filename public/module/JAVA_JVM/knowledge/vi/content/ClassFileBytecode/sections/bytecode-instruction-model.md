Bytecode là instruction set của JVM. Mỗi instruction có opcode và có thể có operand đi kèm. Instruction thường thao tác trên operand stack, local variables, object/array hoặc symbolic reference trong runtime constant pool.

Ví dụ source:

```java
int add(int a, int b) {
    return a + b;
}
```

Conceptually có thể trở thành:

```text
iload_1
iload_2
iadd
ireturn
```

Điểm đáng học không phải nhớ opcode, mà là hiểu execution model **stack-oriented**: value được load lên operand stack, instruction consume/produce value, rồi kết quả có thể được return hoặc store.
