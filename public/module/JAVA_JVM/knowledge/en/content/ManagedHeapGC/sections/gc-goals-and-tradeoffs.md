Three goals frequently compete:

**Throughput**
Maximize the fraction of CPU time spent running application work rather than collection.

**Latency / pause time**
Keep individual application pauses short enough for response-time requirements.

**Memory footprint**
Avoid retaining excessive memory headroom.

No collector/configuration optimizes all three perfectly. More heap headroom may reduce collection frequency but increase footprint; a highly concurrent collector may reduce pauses while using extra CPU/resources.

The right question is not “which collector is best?” but:

```text
What does this workload prioritize,
and what SLO/resource constraints matter?
```
