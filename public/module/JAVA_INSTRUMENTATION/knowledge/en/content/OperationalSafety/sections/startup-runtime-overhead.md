Overhead appears in two phases.

**Startup / class loading**

- matcher/filter work for each class;
- parsing/transformation/emission;
- verification and altered JIT warm-up;
- extra cost from multiple chained agents.

**Runtime**

- injected probe instructions;
- helper calls;
- allocations;
- timestamp/counter/locking;
- telemetry buffering/export.

A good agent measures its own overhead:

~~~text
baseline application
vs
agent loaded with no targets
vs
agent with representative instrumentation
~~~

Early targeting, lightweight transform callbacks, and runtime batching/sampling reduce cost.

An observability agent that significantly slows the application can distort the very behavior it is trying to measure.
