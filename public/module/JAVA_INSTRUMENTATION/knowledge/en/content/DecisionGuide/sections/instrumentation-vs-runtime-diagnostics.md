The two modules answer different questions:

~~~text
Instrumentation
→ how is code/a probe inserted into the runtime?

Runtime Diagnostics
→ what does the resulting evidence mean and how is root cause found?
~~~

If the question is:

- “how do I add a timing probe to an already-loaded class?” → Instrumentation;
- “why is service latency high?” → Runtime Diagnostics;
- “is the agent itself increasing latency?” → both: Instrumentation explains probe overhead; Diagnostics measures/evaluates runtime evidence.

This boundary also encourages a better tool architecture: keep data-collection/probe logic separate from analysis/presentation where practical.
