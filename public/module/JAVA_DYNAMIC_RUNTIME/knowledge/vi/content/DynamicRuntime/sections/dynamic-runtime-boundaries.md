Nên học trước:

- Java type system, method/field/constructor và exception;
- Reflection ở mức `Class`, `Method`, `Field`;
- JVM ở mức bytecode, method descriptor và linkage mental model;
- Concurrency fundamentals trước khi suy luận sâu về visibility của `MutableCallSite` hoặc memory ordering của `VarHandle`.

Module này **sở hữu**:

- `MethodType`, `MethodHandle`, signature polymorphism;
- `MethodHandles.Lookup` và quyền truy cập;
- MethodHandle adaptation/composition;
- `CallSite`, bootstrap linkage và `invokedynamic`;
- `VarHandle` ở góc nhìn typed variable access.

Module này **không sở hữu**:

- metadata/member inspection đầy đủ → Reflection;
- constant pool, bytecode execution, JVM resolution rules đầy đủ → JVM;
- happens-before/JMM và thiết kế thuật toán lock-free → Concurrency;
- JNI/FFM/native memory → Native Interoperability;
- lịch sử feature theo từng Java release → Java Version.

Khi đọc tiếp, hãy giữ câu hỏi: **primitive này giải quyết phần nào của hành vi runtime, và phần nào phải chuyển sang module khác?**
