An **idempotent** transformation aims for a stable intended result when it sees the same valid input state. But retransformation must be modeled correctly: for a transformer registered with canRetransform=true, the JVM **does not** feed that transformer's own previous retransformation output back into the next retransformation. It starts again from the initial/latest-redefinition baseline, reapplies outputs of retransformation-incapable transformers, then invokes capable transformers again.

So this is an **incorrect mental model**:

~~~text
retransform #1 → probe A
retransform #2 → probe A + probe A
retransform #3 → probe A + probe A + probe A
~~~

A correctly modeled retransformation-capable transformer does not accumulate its own previous output that way.

Duplicate probes can still occur when the **baseline input already contains instrumentation** from build-time weaving, a replacement definition, retransformation-incapable transformers, or when equivalent transformation logic is registered/run multiple times in one pipeline. In those cases the transformer should recognize existing instrumentation instead of blindly adding another copy.

Strategies include:

- understand the exact baseline bytes guaranteed by the retransformation contract;
- detect markers/instructions/helper calls added by the agent;
- generate transformations deterministically from configuration;
- separate “desired instrumentation state” from “current bytes”;
- test load → retransform → retransform repeatedly.

Idempotence is especially important when an agent coexists with prior instrumentation, multiple transformers, or dynamic configuration. If an agent cannot reason about which bytes enter each pipeline stage, safe restoration becomes much harder.
