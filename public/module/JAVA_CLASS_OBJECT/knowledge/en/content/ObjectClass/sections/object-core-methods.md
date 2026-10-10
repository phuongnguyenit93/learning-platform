Important methods include:

- `getClass()` — reports the runtime class of the object;
- `toString()` — provides a textual representation hook;
- `equals()` — defines logical-equality behavior when overridden correctly;
- `hashCode()` — supplies a hash value that must remain consistent with `equals()`;
- `wait()/notify()/notifyAll()` — low-level monitor coordination, owned by concurrency material;
- `clone()` — a legacy copying mechanism with difficult semantics;
- finalization behavior — legacy cleanup behavior that should not be used for resource management.

`equals`, `hashCode`, and `toString` are explored deeply in the `object-contract` module. `getClass()` becomes more important in Reflection, while `wait/notify` belongs to concurrency.
