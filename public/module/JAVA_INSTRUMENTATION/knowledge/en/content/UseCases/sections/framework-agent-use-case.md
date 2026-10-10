Many frameworks and tools use a Java agent as the bootstrap for cross-cutting runtime behavior:

- APM/observability agents;
- test coverage;
- runtime mocking/profiling tools;
- security scanning/protection hooks;
- ORM/framework diagnostics.

A common architecture is:

~~~text
Java Agent
→ discover runtime/framework version
→ choose instrumentation modules
→ install transformers
→ inject calls to agent runtime/helper
→ collect/control behavior
~~~

That explains why production agents contain more layers than a small tutorial:

- matcher registry;
- compatibility/version rules;
- helper injection;
- configuration;
- telemetry pipeline;
- safe disable/rollback.

This module focuses on Java Instrumentation foundations so those systems are understandable without recreating every vendor framework.
