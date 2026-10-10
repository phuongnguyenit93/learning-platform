A profiler needs runtime measurements without requiring every application method to contain hand-written timing code.

An agent can:

~~~text
match OrderService.placeOrder
→ inject timestamp at method entry
→ record duration on normal/exceptional exit
→ send samples/counters to profiler runtime
~~~

Overhead is the central trade-off. Timing every method with expensive probes can alter the behavior being measured.

Real profilers often:

- target selected methods/packages;
- sample or aggregate rather than record every detailed event;
- avoid allocation on hot paths;
- use optimized helper runtimes;
- allow probes to be enabled/disabled dynamically.

Instrumentation owns **probe injection**. Statistical analysis, visualization, and full performance methodology are broader profiler/diagnostics concerns.
