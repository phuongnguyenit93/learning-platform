Java Instrumentation does not expose every JVM tooling capability.

When a requirement needs:

- low-level VM events unavailable through java.lang.instrument;
- deeper native-method/runtime hooks;
- JVMTI-level heap/thread/GC events;
- a native agent operating outside/before the Java-level agent model;
- control beyond the redefine/retransform contract;

the next boundary is JVMTI/native agents.

Mental-model handoff:

~~~text
Java Instrumentation
→ high-level Java agent + class-file transformation

JVMTI
→ native VM tooling interface with a broader event/capability surface
~~~

Do not try to “work around” Instrumentation constraints with unsupported bytecode tricks. If the contract is insufficient, choose the correct lower-level tooling layer.
