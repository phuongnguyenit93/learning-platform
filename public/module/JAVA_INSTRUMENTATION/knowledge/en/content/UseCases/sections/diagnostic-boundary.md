Instrumentation and Runtime Diagnostics overlap in practice but own different questions:

~~~text
Instrumentation
→ "how do I inject a probe to collect data?"

Runtime Diagnostics
→ "what does this data/thread dump/JFR/heap evidence say about the incident?"
~~~

Suppose an agent injects timing probes and reports rising p99 latency. Instrumentation explains:

- where the probe was inserted;
- which classes were transformed;
- probe overhead;
- runtime configuration/retransformation.

Runtime Diagnostics continues with:

- is latency caused by CPU, locks, GC, or downstream I/O?
- which thread/JFR evidence confirms the hypothesis?

This boundary prevents Instrumentation from becoming a complete observability course while still explaining why it is a powerful data-collection mechanism.
