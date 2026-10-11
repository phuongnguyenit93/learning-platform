Arguments and return values cross the FFM boundary through **carrier types** derived from the layouts in the `FunctionDescriptor`.

Typical relationships include:

| Layout | Java carrier shape |
| --- | --- |
| integer `ValueLayout` | matching Java primitive |
| floating-point `ValueLayout` | matching Java primitive |
| `AddressLayout` | `MemorySegment` representing an address |
| supported group layout | `MemorySegment` representing structured value storage |

This is why the descriptor and the method handle type are connected. If the descriptor says an argument is an address, the Java invocation supplies a `MemorySegment`, not a raw Java `long` pretending to be a pointer.

Pointer-returning functions deserve special care. In Java 21, when a downcall return layout is a plain `AddressLayout`, the returned native `MemorySegment` has size `0` and a fresh scope that is always alive. If that return `AddressLayout` has a target layout `T`, the returned segment size is `T.byteSize()`. Those Java-side bounds/scope semantics still do **not** prove that the native allocation is actually alive, owned by Java, or safe for that duration. Establishing a usable region therefore requires the real native size/lifetime contract and can require restricted `reinterpret(...)` when Java must attach different bounds or lifetime management.

Carrier compatibility is necessary but not sufficient: the native function's real ABI signature still has to match the descriptor.
