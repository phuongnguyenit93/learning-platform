An evidence plan should be expressible as a testable question:

~~~text
Hypothesis:
Requests are stuck because of lock contention.

Need to know:
Do the same threads remain BLOCKED on the same lock over time?

Evidence:
Three thread dumps ten seconds apart plus JFR lock events.

Decision:
If owners and blocked stacks repeat → investigate concurrency.
If not → examine I/O or downstream latency.
~~~

A good plan states the current hypothesis, required data, expected collection impact, timing/repetition, interpretation criteria, and the next step for both a positive and a negative result.

That turns troubleshooting into a falsifiable process instead of an unstructured sequence of commands.
