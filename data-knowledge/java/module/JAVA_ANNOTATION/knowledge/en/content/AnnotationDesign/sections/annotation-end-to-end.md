The whole module can be viewed as a metadata pipeline:

```text
define a metadata vocabulary
→ elements + defaults
→ retention: how long metadata survives
→ target: where metadata is legal
→ meta-annotations: configure the annotation contract
→ repeatable/inherited: lookup semantics
→ compile-time processor or runtime consumer reads metadata
```

For the running `@Audit` example, the complete design flow is:

```text
Problem
→ describe which methods require auditing
        ↓
Annotation schema
→ action, level
        ↓
@Target
→ METHOD if the contract only makes sense on methods
        ↓
@Retention
→ RUNTIME when a runtime component must read it
→ SOURCE when a compile-time processor is the only consumer
        ↓
Consumer
→ processor / Reflection / framework
        ↓
Behavior
→ validate / generate / register / audit
```

The invariant across the entire module is:

> **An annotation describes metadata. Behavior comes from the consumer that reads and interprets that metadata.**

That is why the same `@Something` syntax can lead to completely different effects depending on its consumer.
