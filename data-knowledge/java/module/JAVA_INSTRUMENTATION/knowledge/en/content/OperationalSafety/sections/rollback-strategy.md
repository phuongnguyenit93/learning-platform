Rollback is not the same as removeTransformer.

To remove instrumentation from already-transformed classes, an agent needs a strategy:

~~~text
disable transformer behavior
→ remove registration when appropriate
→ identify affected classes
→ retransform/redefine toward desired uninstrumented form
→ verify success
~~~

For a retransformation-capable transformer, a common approach is to change configuration to “do not instrument” and retransform targets. Remember that earlier retransformation-incapable transformations are still automatically reused.

With redefine, the agent may preserve/restore known baseline bytes, but baseline management becomes complex with multiple agents or previous redefinitions.

Test rollback as a feature:

- active-frame transition;
- per-call atomicity: if one redefineClasses/retransformClasses invocation throws, none of the classes in that supplied set are changed;
- partial progress across a multi-call/chunked workflow: earlier calls may already have succeeded before a later call fails;
- helper visibility after rollback;
- telemetry-state cleanup;
- multiple agents modifying the same class.
