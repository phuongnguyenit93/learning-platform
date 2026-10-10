FFM is easier to understand as a small set of cooperating abstractions rather than a large bag of methods.

| Abstraction | Responsibility |
| --- | --- |
| `MemorySegment` | bounded view of a contiguous memory region |
| `Arena` | allocation plus lifetime/thread-access policy for native segments |
| `MemoryLayout` | size, alignment, and structured interpretation of bytes |
| `SymbolLookup` | find a native symbol and obtain its address |
| `Linker` | adapt Java calls/callbacks to the current native ABI |
| `FunctionDescriptor` | describe native function parameter/return layouts |

They connect in an end-to-end foreign-call flow:

```text
Arena allocates arguments
      ↓
MemorySegment holds native data
      ↓
MemoryLayout describes its shape
      ↓
SymbolLookup finds function
      ↓
FunctionDescriptor describes signature
      ↓
Linker creates downcall handle
      ↓
Java invokes native function
```

Each later chapter isolates one responsibility so failures can be traced to the right contract: memory bounds, lifetime, layout, symbol resolution, or linkage.
