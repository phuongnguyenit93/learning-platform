ThreadLocal helps avoid sharing a context value between Threads.

It does not make other shared objects self-thread-safe and is not a replacement for lock/Atomic on the shared state.

Especially with pools, always think about worker reuse and cleanup.

A bean scope is also not a Thread scope. `@RequestScope` does not mean "one bean per worker", and the session-scoped mutable state can still be accessed by many requests with the same session accessing concurrent.
