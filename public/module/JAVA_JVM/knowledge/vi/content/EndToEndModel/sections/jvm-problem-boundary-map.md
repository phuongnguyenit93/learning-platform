Khi gặp vấn đề runtime, xác định đúng owner trước:

```text
class được tìm/load bởi ai, identity/delegation?
→ ClassLoader

MethodHandle/CallSite/VarHandle/linkage API?
→ Dynamic Runtime

agent/transform/redefine class?
→ Instrumentation

JNI/FFM/native call/memory lifetime?
→ Native Interoperability

thread-safety/happens-before?
→ Concurrency

heap dump/JFR/NMT/bằng chứng root-cause?
→ Runtime Diagnostics
```

JVM module là bản đồ nền: nó giúp biết cơ chế nào đang tham gia để chuyển sang tool/module chuyên sâu đúng lúc.
