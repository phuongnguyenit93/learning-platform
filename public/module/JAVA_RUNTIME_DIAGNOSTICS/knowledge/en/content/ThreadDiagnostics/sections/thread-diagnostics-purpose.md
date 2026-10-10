Thread diagnostics answers **“what are threads doing, and why is work not progressing?”** It is useful for hangs, slow requests, high CPU, exhausted thread pools, suspected deadlocks, or many threads waiting for the same resource.

A thread dump is not execution history. It is a point-in-time view of:

- thread identity;
- Java state;
- stack trace;
- monitor/lock information when supported by the tool;
- sometimes deadlock summaries.

Thread evidence should therefore be used to form and test a hypothesis, not as automatic proof from one snapshot.

The boundary matters: this module reads runtime evidence. Detailed synchronized/Lock semantics, happens-before, and concurrency correctness belong to Java Concurrency.
