Thread dumps, heap histograms, and NMT summaries are point-in-time snapshots. They are valuable, but they can miss problems that last only seconds or require understanding the **sequence before, during, and after** an incident.

Java Flight Recorder (JFR) is the JDK/HotSpot event-recording mechanism. It captures runtime and application events on a timeline with overhead designed to be low enough for many production scenarios.

JFR is useful for questions such as:

- which code paths coincide with a CPU spike?
- what lock activity preceded a latency increase?
- when did allocation begin to grow?
- do GC, I/O, and thread activity line up in the same interval?
- are virtual threads being pinned or failing to submit?

Mental model:

~~~text
snapshot tool
→ state at one point in time

JFR
→ timestamped event stream with duration, context, and optional stacks
~~~

JFR does not automatically produce a root cause; it provides a contextual timeline for testing hypotheses.
