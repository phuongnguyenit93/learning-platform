Module JVM sở hữu mô hình tư duy về cách class-file code trở thành runtime state và được thực thi: runtime data areas, frame, managed heap, các khái niệm GC, interpreter/JIT, nhận thức về native memory và ergonomics.

Nhưng một số chủ đề chỉ chạm vào JVM rồi chuyển sang module chịu trách nhiệm khác:

- **ClassLoader**: JVM cần loading/linking, nhưng API/delegation/class-loader identity chuyên sâu thuộc Java Core ClassLoader.
- **Concurrency**: JVM có thread-private/shared runtime areas, nhưng happens-before và Java Memory Model thuộc Concurrency.
- **Dynamic Runtime**: constant pool/linkage là nền tảng, còn MethodHandle/CallSite/VarHandle programming model thuộc Dynamic Runtime.
- **Instrumentation**: JVM có biểu diễn class ở runtime, nhưng Java Agent/ClassFileTransformer thuộc Instrumentation.
- **Native Interoperability**: JVM dùng native resources, còn JNI/FFM programming thuộc Native Interoperability.
- **Runtime Diagnostics**: JVM tạo ra hành vi runtime, còn thu thập heap dump, JFR, NMT hay quy trình troubleshooting thuộc Runtime Diagnostics.

Giữ ranh giới này giúp module giải thích **cơ chế**, còn các module phía sau giải thích cách điều khiển, mở rộng hoặc chẩn đoán cơ chế đó.

Toàn bộ module đi theo một chuỗi học thống nhất:

```text
JVM + class-file contract
→ class file / bytecode / pre-execution lifecycle
→ runtime data areas + frames
→ managed heap + GC
→ interpreter + JIT + adaptive optimization
→ whole-process memory
→ HotSpot ergonomics / VM controls
→ end-to-end JVM mental model
```

Chuỗi này là bản đồ cho các chapter tiếp theo: mỗi chapter mở rộng một phần của cùng execution model, thay vì là một tập thuật ngữ độc lập.
