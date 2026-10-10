The creation of an object in Thread A does not automatically mean that Thread B can read the object through any shared reference and receive all necessary guarantees by default.

What needs to be determined is **reference to the object published to another thread using any boundary**.

Some familiar publication boundaries have appeared in the module:

```text
Write the reference to the Volatile field
→ volatile happens-before edge

write/read under monitor or Lock
→ Synchronization Edge

Put objects in a concurrent collection using an API with a memory-consistency guarantee
→ publication under the contract of the collection

prepare the object before Thread.start()
→ start rule

prepare the object before Executor.execute/submit(...)
→ executor submission guarantee
```

### Final Field has special initialization-safety

The Java Memory Model has special rules for `FINAL` Field.

For example:

```java
final class UserSnapshot {
    private final String id;
    private final int level;

    UserSnapshot(String id, int level) {
        this.id = id;
        this.level = level;
    }
}
```

If the object is **construct properly** and reference `this` without escape before the constructor is finished, JMM provides stronger initialization-safety for the `FINAL` field assigned in the constructor.

Mental models should keep:

```text
Constructor completed properly
        ↓
final fields are frozen according to JMM
        ↓
Other threads get references to objects
        ↓
There is a special guarantee to see that the final value has been initialized
```

This is one reason immutable objects with `FINAL` Fields are very useful in concurrent design.

But it shouldn't be reduced to:

```text
Object has several final fields
→ all objects automatically thread-safe
→ every mutable field/mutation after the constructor is published safely
```

`FINAL` protect the semantics of the final field initialization; it does not replace synchronization for the mutable shared state afterwards.

### This Escape: Publish Object Too Soon

An object is **this escape** when its own reference can be observed by other threads before the constructor is complete.

Examples of design hazards:

```java
class Listener {
    private final String configuration;

    Listener(EventBus bus) {
        bus.register(this); this escaped
        this.configuration="READY";
    }
}
```

If `register(this)` making this reference reachable from another thread immediately, that thread can observe the object while the construction is not complete. This is why the constructor should complete the invariant before the object is published.

Pattern is easier to reason:

```text
Complete Construct
→ Invariant Setup
→ constructor return
→ publish object via explicit boundary
```

### Why is there no "unsafe publication" endpoint?

Similar to the reordering/stale-read demo, partially initialized observation of code with a data race is not a deterministic outcome that the endpoint can guarantee reproducibility on any JVM/machine.

Failure to observe errors in 10,000 runs does not prove that unsafe publication is correct.

So the module uses **positive guarantees** To learn:

```text
Final-Field Initialization Safety
volatile / monitor / Lock
Thread.start /join
Executor / Future / concurrent collection
```

instead of hunting a random execution of code with no guarantees.

**Final Thoughts** A good concurrency designer not only asks "Has the object been created?", but also asks **object published to another thread using which memory-consistency boundary** and **whether there is an escape before the construction is completed.**.
