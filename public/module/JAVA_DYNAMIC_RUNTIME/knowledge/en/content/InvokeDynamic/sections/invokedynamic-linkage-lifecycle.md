Simplified lifecycle:

```text
1. JVM encounters an unlinked invokedynamic instruction
        ↓
2. Resolve bootstrap method + static bootstrap arguments
        ↓
3. Invoke bootstrap
        ↓
4. Bootstrap returns a CallSite
        ↓
5. JVM validates the CallSite type
        ↓
6. Instruction becomes linked to that CallSite
        ↓
7. Invocation dispatches through the current target
```

Bootstrap can be executed lazily when the instruction first needs linking. Therefore “bootstrap runs on every call” is incorrect.

If several threads reach the same still-unlinked call site concurrently, the bootstrap method **may be invoked concurrently more than once**. The JVM installs one result; other bootstrap invocations may finish but their results are ignored. Bootstrap logic that touches shared application state must therefore still be thread-safe.

If a mutable CallSite later changes target, the instruction remains linked to the same CallSite; only the target observed through the site changes. Each `invokedynamic` instruction transitions from unlinked to linked at most once, although bootstrap logic may intentionally return the same `CallSite` object for multiple different instructions.
