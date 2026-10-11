Inside managed Java, many safety and lifecycle rules are enforced by the language and JVM. An ordinary object reference does not expose a raw address, and the garbage collector can reclaim an object after it becomes unreachable. Array access is bounds-checked, Java method signatures are type-checked, and Java exceptions have defined propagation semantics.

Crossing into native code changes the assumptions. A native function may expect a pointer to exactly 24 bytes with a particular alignment. A shared library may expose a symbol whose binary signature must match the caller. Native code can dereference invalid addresses, write outside an allocation, retain a callback after Java has released its supporting resources, or crash the process.

Think of the boundary as a contract translation:

| Managed Java concept | Native-boundary counterpart |
| --- | --- |
| Java type | ABI carrier / native layout |
| object reference | JNI reference or native address |
| GC-managed lifetime | explicit/native resource lifetime |
| Java method call | native symbol + calling convention |
| Java exception | JNI pending exception, error code, errno-style contract, or process failure |

The JVM still runs the Java side, but it cannot make arbitrary native code memory-safe. Interoperability APIs reduce classes of mistakes and make responsibilities explicit; they do not turn native execution into ordinary managed Java.
