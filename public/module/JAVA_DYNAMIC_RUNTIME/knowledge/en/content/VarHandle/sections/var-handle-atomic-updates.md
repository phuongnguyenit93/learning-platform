The compare-and-set family performs a conditional update:

```java
boolean updated =
        (boolean) VALUE.compareAndSet(
                counter,
                expected,
                next
        );
```

```text
read current
→ witness matches expected under the access mode's comparison semantics?
    ├─ yes → write next + success
    └─ no  → no write + failure
```

For references and most primitives this is close to thinking in terms of `==`. For `float` and `double`, numeric and atomic update modes compare the **bitwise representation**, so NaN payloads and `-0.0` versus `+0.0` can behave differently from primitive `==`.

`compareAndExchange` returns the witness/current value instead of only a boolean. Weak CAS variants may fail spuriously even when the expected value matches, so they are commonly used inside retry loops.

`getAndAdd`, `getAndSet`, and bitwise update variants are read-modify-write operations.

Do not jump from these primitives to “lock-free is always faster.” Correctness, contention, and progress guarantees belong to the Concurrency curriculum.
