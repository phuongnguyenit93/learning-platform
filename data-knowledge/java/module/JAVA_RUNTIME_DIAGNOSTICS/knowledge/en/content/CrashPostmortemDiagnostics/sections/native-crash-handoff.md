Runtime Diagnostics owns enough native evidence handling to determine that the investigation has crossed the Java/native boundary. Once the remaining questions require JNI contracts, native library loading, ABI behavior, pointer/memory lifetime, or FFM mechanics, hand off to **Native Interoperability**.

Typical handoff signals include:

- the fatal log points into an application native library;
- failure occurs in a JNI call or callback;
- the core shows a native stack or memory-corruption evidence;
- process RSS grows while Java heap and JVM-internal NMT data cannot explain it;
- the failure depends on architecture, native symbols, or library versions.

Diagnostics still supplies the input evidence: PID, timestamps, hs_err, core file, stacks, JFR, and loaded-library information. Native Interoperability owns the semantics needed to explain JNI/FFM/native-memory behavior.

Do not hand off merely because a stack contains a native frame. Many valid JDK operations pass through native code; correlate the frame with the actual failure first.
