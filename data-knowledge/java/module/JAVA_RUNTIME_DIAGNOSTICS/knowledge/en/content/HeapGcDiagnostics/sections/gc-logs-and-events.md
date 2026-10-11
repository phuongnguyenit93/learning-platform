GC logs provide a timeline of collection activity. With unified logging:

~~~text
-Xlog:gc*
~~~

GC evidence helps answer:

- how often collections run;
- whether pause time is changing;
- how heap size changes before and after collection;
- whether collections successfully reclaim memory.

Reasoning example:

~~~text
GC runs constantly
post-GC heap still rises
→ retention becomes more plausible

GC runs frequently
post-GC heap stays stable
→ allocation pressure or heap sizing may be more relevant
~~~

JFR GC events add timeline correlation with CPU, threads, and I/O.

When interpretation requires collector internals, hand off to the JVM curriculum rather than duplicating it here.
