`guardWithTest` selects between two compatible targets using a predicate handle:

```text
test(args)
 ├─ true  → target(args)
 └─ false → fallback(args)
```

```java
MethodHandle guarded =
        MethodHandles.guardWithTest(
                test,
                fastPath,
                fallback
        );
```

Important type invariants:

- `test` must return `boolean`;
- `target` and `fallback` must have the same type;
- the parameters consumed by `test` must match a **prefix** of the target/fallback parameters; the test may consume fewer arguments.

If these types do not line up, `guardWithTest` throws `IllegalArgumentException` while the adapter is being built, before the resulting handle is invoked.

`SwitchPoint` adds one-way invalidation. Before invalidation, a guard can use the primary target; after invalidation, it permanently falls back.

```text
cached assumption valid
→ fast target

assumption invalidated
→ SwitchPoint.invalidateAll(...)
→ fallback thereafter
```

This is different from `MutableCallSite`: SwitchPoint models a **one-way invalidated assumption**, while a mutable call site's target can be updated repeatedly.
