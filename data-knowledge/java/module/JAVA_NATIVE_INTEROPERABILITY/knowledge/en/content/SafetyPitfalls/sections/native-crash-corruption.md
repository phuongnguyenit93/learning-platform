The most important difference between ordinary Java failures and native failures is **failure severity**. A NullPointerException normally leaves the JVM process alive; native memory corruption can damage or terminate the entire process before Java can throw anything useful.

Typical causes include:

- invoking a function pointer with the wrong descriptor;
- native code writing past a buffer boundary;
- dereferencing a pointer after its lifetime has ended;
- calling an upcall stub after it has been released;
- ABI or layout mismatches;
- bugs inside the native library itself.

Silent memory corruption is often worse than an immediate crash because the visible symptom can appear long after the original mistake.

Prevention matters more than exception handling: keep the native boundary small, use FFM spatial and temporal checks, validate descriptors and layouts, make ownership explicit, and use native sanitizers or debuggers when appropriate. No Java try/catch can turn arbitrary undefined native behavior into a recoverable Java error.

Once those failure boundaries are understood, the final chapter turns them into design criteria: when to choose JNI, FFM, an existing wrapper, or no native boundary at all, and how to review the integration end to end.
