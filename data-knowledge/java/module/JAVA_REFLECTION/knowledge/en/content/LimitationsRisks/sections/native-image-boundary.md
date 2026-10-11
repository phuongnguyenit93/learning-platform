This is a **deployment/runtime boundary**, not prerequisite knowledge for understanding `Method.invoke()` or `Field.get()`. A few terms make the problem easier to follow:

- **JVM/HotSpot**: the ordinary Java execution model in which bytecode is loaded by a JVM and may be JIT-compiled while the application runs;
- **AOT (ahead-of-time)**: compilation performed before the application starts rather than leaving all compilation/resolution decisions to runtime;
- **native executable**: a platform-specific executable built ahead of time;
- **closed-world analysis**: a build-time model that assumes the set of code that must remain available can be determined from what the build can observe;
- **reachability metadata**: extra declarations that tell the build tool which dynamically discovered classes or members must still be retained.

On a normal JVM, an application can decide at runtime which class/member it needs and then ask reflection to find it. An AOT native-image system using a closed-world model has a different problem: the build tool must determine which program elements need to exist in the native executable.

GraalVM Native Image is a common example. Static analysis can recognize some reflective access when targets are sufficiently clear at build time, but access driven by runtime strings or configuration often requires **reachability metadata** declaring classes, methods, fields, proxies, or other dynamic features that must remain available.

The mental model is:

```text
JVM dynamic world
runtime input → choose member → reflection discovers member

native-image closed world
build-time analysis + reachability metadata
        ↓
decide what must exist in the executable
```

A reflection-heavy framework therefore needs to consider native-image integration at its metadata layer. Code that works correctly on HotSpot may fail in a native executable if dynamically accessed elements were not discoverable or registered for reachability.

Native-image configuration is a deployment/runtime boundary; it does not redefine Java Reflection semantics on the JVM. Keep those hints or metadata in the framework/integration layer instead of spreading native-image concerns through business classes.
