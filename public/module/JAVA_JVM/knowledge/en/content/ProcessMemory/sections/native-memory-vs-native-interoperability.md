The JVM module teaches **native-memory awareness** so you can reason about total process footprint and runtime implementation resources.

Native Interoperability teaches how Java code **actively crosses the native boundary** using mechanisms such as:

- JNI;
- the Foreign Function & Memory API;
- native-library loading;
- linker/symbol lookup;
- explicit native-memory lifetime.

```text
JVM Process Memory
→ “Where is the runtime consuming memory?”

Native Interoperability
→ “How does Java code call or access native resources?”
```

The topics meet around memory safety and lifetime, but they have different learning goals.
