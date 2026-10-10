An ABI, or Application Binary Interface, defines the machine-level contract between independently compiled pieces of code. Source types alone are not enough. The caller and callee must agree on details such as argument placement, return-value representation, register/stack usage, alignment, structure layout rules, and the platform calling convention.

For example, these source declarations look simple:

```c
long sum(long a, long b);
```

but the width of C `long` is platform-dependent. A Java `long` is always 64 bits, so blindly mapping one to the other can be wrong on a platform where native `long` is 32 bits.

FFM's native `Linker` exists to adapt Java carriers and memory layouts to the ABI supported by the current platform. JNI defines its own set of JNI primitive types such as `jint` and `jlong` to make the Java/JNI contract explicit.

The practical rule is: derive layouts and descriptors from the native ABI you are actually calling. Do not infer them only from a Java type with a similar name.
