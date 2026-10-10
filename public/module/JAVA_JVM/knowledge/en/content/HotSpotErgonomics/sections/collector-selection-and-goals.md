Collector selection should begin with workload requirements, not personal preference.

Ask:

- Are latency SLOs strict?
- Is throughput more important than pauses?
- How large are the heap and live set?
- Is there CPU budget for concurrent collection?
- Is memory footprint tightly constrained?

Oracle's GC tuning guidance recommends beginning with VM defaults when the application has no unusually strict pause requirements and measuring before changing collectors.

A collector is a system-level trade-off. Switching collectors can change CPU use, pause distribution, footprint, and operational behavior; it is not simply “a flag that makes Java faster.”
