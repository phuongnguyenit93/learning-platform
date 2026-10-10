Crossing the native boundary removes several assumptions that Java developers normally rely on. The most serious costs are not syntax costs; they are **contract, lifetime, portability, and failure costs**.

Typical risks include:

- loading the wrong library build for the current OS or CPU;
- describing a native function with the wrong ABI signature;
- using the wrong size, alignment, or field offset for native data;
- retaining JNI local references beyond their valid lifetime;
- leaking global references, native allocations, file mappings, or callback stubs;
- using an FFM segment after its scope has become invalid;
- sharing confined resources across the wrong thread;
- allowing native code to write outside valid memory;
- receiving a fatal native fault that terminates the JVM process instead of producing a normal Java exception.

The practical response is to make every boundary explicit:

```text
library + platform
        ↓
symbol + ABI
        ↓
data layout + memory ownership
        ↓
call/callback lifetime
        ↓
error propagation + cleanup
```

These concerns drive the rest of the module. JNI and FFM differ in API shape, but both ultimately depend on correct binary contracts and disciplined resource ownership.
