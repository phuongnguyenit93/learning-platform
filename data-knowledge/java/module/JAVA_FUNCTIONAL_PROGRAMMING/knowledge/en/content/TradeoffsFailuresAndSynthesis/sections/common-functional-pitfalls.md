Several recurring mistakes come from confusing compact syntax with better design:

- assuming every lambda is pure or thread-safe;
- mutating captured objects and forgetting that later calls share the same state;
- choosing `compose`/`andThen` in the wrong semantic order even when the types compile;
- forcing a method reference when a lambda would make argument mapping clearer;
- hiding checked-exception translation inside generic wrappers;
- calling `Optional.get()` or spreading `Optional` everywhere without a clear absence contract;
- building chains so long that debugging and business intent disappear;
- assuming knowledge of lambdas is enough to infer Stream execution semantics.

The common fix is not "avoid functional style". It is to keep type contracts, state, effects, execution order, and module boundaries explicit.
