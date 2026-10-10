Stop or hand off an investigation when:

- evidence strongly confirms the hypothesis and the fix belongs to another domain;
- the next question requires semantics Runtime Diagnostics does not own;
- the remaining work depends on a specialized tool/platform;
- additional collection costs more than its expected diagnostic value.

Primary handoffs:

| Evidence points to | Hand off to |
| --- | --- |
| GC/JIT/runtime-memory mechanics | JAVA_JVM |
| locks/happens-before/concurrency correctness | JAVA_CONCURRENCY_FUNDAMENTALS |
| need for active bytecode instrumentation | JAVA_INSTRUMENTATION |
| JNI/FFM/native library or memory | JAVA_NATIVE_INTEROPERABILITY |
| Arthas or tool-specific runtime analysis | the observability tool owner |

A good handoff includes the collected evidence and current hypothesis, not merely “this looks like a JVM issue.” That lets the receiving domain continue the investigation instead of starting over.
