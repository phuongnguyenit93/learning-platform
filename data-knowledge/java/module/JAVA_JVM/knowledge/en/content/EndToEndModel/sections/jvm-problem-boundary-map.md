When a runtime problem appears, first identify the owning domain:

```text
Where did a class come from? delegation/loader identity?
→ Class Loading

MethodHandle / CallSite / VarHandle / linkage API?
→ Dynamic Runtime

agent / transform / redefine class?
→ Instrumentation

JNI / FFM / native call / explicit native-memory lifetime?
→ Native Interoperability

thread safety / happens-before?
→ Concurrency

heap dump / JFR / NMT / root-cause evidence?
→ Runtime Diagnostics
```

The JVM module is the foundation map: it tells you which runtime mechanism is involved so you can move to the correct specialized module.
