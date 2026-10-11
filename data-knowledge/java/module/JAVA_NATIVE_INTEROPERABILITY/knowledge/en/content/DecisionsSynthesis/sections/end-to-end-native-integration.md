An end-to-end native integration is easier to reason about as a chain of contracts instead of a single API call.

~~~text
1. Identify the native capability that is required
        ↓
2. Choose JNI or FFM
        ↓
3. Fix the library, platform, and ABI target
        ↓
4. Define data layouts and function signatures
        ↓
5. Define ownership and lifetime
        ↓
6. Define call/callback and thread boundaries
        ↓
7. Translate errors across the boundary
        ↓
8. Package, test, and release resources
~~~

Each step should have observable evidence. For example: confirm the symbol exists, verify layout sizes and offsets, test callback registration/unregistration repeatedly, test shutdown behavior, and run on every supported architecture.

When an integration is difficult to debug, walking this chain helps identify whether the problem belongs to loading, ABI, data layout, lifetime, threading, or error propagation instead of treating all native behavior as one opaque box.
