Java 21 provides four standard arena kinds with different lifetime and thread-access behavior.

| Arena | Lifetime | Explicitly closeable | Multi-thread access |
| --- | --- | --- | --- |
| `Arena.global()` | unbounded | no | yes |
| `Arena.ofAuto()` | GC-managed bounded lifetime | no | yes |
| `Arena.ofConfined()` | manually bounded | yes | no; owner thread only |
| `Arena.ofShared()` | manually bounded | yes | yes |

**Global** is convenient for data intended to live for the process lifetime, but its backing memory is never explicitly reclaimed through the arena.

**Automatic** allows the runtime to reclaim memory after the arena and its segments become unreachable, but deallocation timing is unspecified.

**Confined** gives deterministic cleanup and cheap single-thread ownership. It is usually the clearest choice for short-lived native work performed by one thread.

**Shared** also gives deterministic cleanup while allowing access from multiple threads, at the cost of a broader concurrency responsibility for the application.

Choose based on required lifetime and sharing, not convenience alone.
