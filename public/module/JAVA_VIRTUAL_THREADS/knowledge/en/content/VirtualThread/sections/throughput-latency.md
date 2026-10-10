Virtual threads often help **throughput/scalability** when the system needs to keep a lot of concurrent blocking tasks.

They don't make a 500 ms database query into a 50 ms database.

```text
Latency One Operation
→ operation/downstream dependencies

concurrent capacity
→ Virtual Thread can help increase the right workload
```
