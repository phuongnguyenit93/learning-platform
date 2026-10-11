JFR also connects three areas that are often investigated separately: **allocation, GC, and I/O**.

For memory:

- allocation events identify allocating code paths;
- GC events place collection activity on the same timeline;
- old-object sampling can support leak analysis when configured appropriately.

For I/O:

- file/socket events can expose duration and call context;
- correlate I/O with thread parks and request latency to see where time is spent.

High allocation rate is not automatically a memory leak. An application can allocate quickly while GC reclaims objects normally. A leak hypothesis requires retention or trend evidence.

Likewise, frequent GC events are a signal for further JVM/heap analysis; JFR does not replace collector mechanics.
