Atomic classes are suitable for many small transitions such as counter/reference updates.

For example:

```java
AtomicInteger count = new AtomicInteger();
count.incrementAndGet();
```

Mental model CAS:

```text
Read Expected Value
        ↓
New Value Calculation
        ↓
compare-and-set
   ├─ Success → completion
   └─ Failure → reread and retry
```

Atomic doesn't mean that every compound business rule becomes thread-safe. If the invariant goes through multiple objects/fields, locking or other designs may still be needed.

### Demo compareAndSet

References:

```text
SynchronizationController#atomicCas()
GET /synchronization/atomic-cas
```

The Experiment starts with:

```text
AtomicInteger = 10
```

then try two CAS:

```text
compareAndSet(10, 20)
→ true
→ value = 20

compareAndSet(10, 30)
→ false because expected=10 was stale
→ value still = 20
```

The important point is that CAS does not mean "set if you like". The update is only successful if the current state is still the expected value/reference that the caller relies on to calculate the transition.

### AtomicReference and ABA

The CAS on the reference usually compares the current value to the expected reference.

An advanced issue is ABA:

```text
A → B → A
```

CAS only sees the final value as A and may not know that the state has changed in between. Abstractions such as `AtomicStampedReference` a version/stamp can be attached when it is necessary to detect this case.

Experiment `/atomic-cas` Create the correct sequence:

```text
AtomicReference
A → B → A
stale observer still retains expected reference A
compareAndSet(A, C)
→ succeed in this experiment
```

because plain CAS only sees the current reference as `A`; It doesn't carry with it the history that the state has passed through `B`.

Then the same sequence is run with `AtomicStampedReference`:

```text
A, stamp=0
→ B, stamp=1
→ A, stamp=2

CAS equals expected A + stale stamp=0
→ false
```

**Final Thoughts** stamp/version helps to detect "the value looks the same but the history has changed". Not all CAS use cases have ABA problems; versioning is only added when the invariant really needs to know the intermediate transition.

### Atomic classes worth knowing

It is not necessary to memorize the entire package, but it is recommended to recognize the groups:

| Team | Example | Goal |
| --- | --- | --- |
| Primitive-like | `AtomicInteger`, `AtomicLong`, `AtomicBoolean` | Simple State Transition |
| Reference | `AtomicReference`, `AtomicStampedReference`, `AtomicMarkableReference` | Atomic Reference / Versioned Reference |
| Array | `AtomicIntegerArray`, `AtomicLongArray`, `AtomicReferenceArray` | Atomic Access by Element |
| High-contention counter | `LongAdder`, `DoubleAdder` | Multiple updates, next aggregate |
| Accumulator | `LongAccumulator`, `DoubleAccumulator` | reduction function as max/min/sum |
| Field updater | `AtomicIntegerFieldUpdater`, ... | Specialized Atomic Update Field |

The module uses two representative experiments:

```text
SynchronizationController#atomicCas()
→ CAS / AtomicReference / ABA / AtomicStampedReference

SynchronizationController#atomicTools()
→ AtomicInteger / LongAdder / LongAccumulator
```
