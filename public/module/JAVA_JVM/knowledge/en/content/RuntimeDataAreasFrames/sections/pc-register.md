Each JVM thread has its own `pc` (program counter) register. While a thread executes a non-native method, this register represents the current JVM instruction position according to the implementation's execution model.

It exists because the runtime needs to know where a thread is in its instruction stream so execution can proceed through branches, calls, and scheduling transitions.

For a native method, the specification does not define the `pc` value in the same way.

Application code does not manipulate the JVM `pc` directly; this concept completes the picture of per-thread execution state beyond just “stack and heap.”
