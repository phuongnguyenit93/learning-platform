Three ideas are often confused.

**Heap usage**  
How much Java heap is occupied at a point in time.

**Allocation pressure**  
How quickly new objects are created. High allocation can cause frequent GC without implying a leak.

**Memory pressure**  
Insufficient headroom in heap, native memory, or the OS/container limit.

Example:

~~~text
high allocation rate
GC reclaims successfully
post-GC heap stays stable
→ no leak evidence yet

post-GC heap rises over time
→ investigate retention
~~~

Trend and post-GC usage usually tell more than one peak value.
