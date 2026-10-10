I/O is often slower than CPU work because it crosses into filesystems, storage, or networks. That does not mean a more complicated API is automatically faster.

Common cost patterns include:

~~~text
many tiny system calls
→ buffering may help

copying data through several layers
→ channel transfer/direct buffers may help for suitable workloads

loading a very large file at once
→ streaming reduces memory pressure

large random-access workload
→ FileChannel/memory mapping may fit

flush/force too frequently
→ increases durability cost
~~~

Here a **system call** is a transition from the application into the operating system for work such as file I/O; **memory pressure** means the cost/risk of retaining too much data in memory; **contention** means several threads or processes compete for the same resource; and **durability** describes whether data has been pushed far enough down the storage stack to survive the failures the application cares about.

A sound optimization order is:

~~~text
1. Choose the correct abstraction and make the code correct.
2. Establish clear memory/resource bounds.
3. Measure the real workload with profiling, benchmarks, or metrics.
4. Identify the actual bottleneck: CPU, allocation, syscall, disk, network, or contention.
5. Optimize only where evidence points.
~~~

An 8 KB buffer is not a universal optimum. Suitable sizes depend on storage, workload, concurrency, and access pattern. Direct buffers, `transferTo`, and memory mapping all have costs of their own.

For most business code, a clear implementation using `Files`, buffered streams, or Reader/Writer is a good starting point. When measurement shows that the I/O path is a bottleneck and identifies the type of bottleneck, there is enough information to decide whether channels, direct buffers, transfer operations, or memory mapping are justified.

The entire module can now return to one coherent mental model:

~~~text
what is the payload?
→ bytes or characters

what are the source and sink?
→ file, memory, network, ...

how does data move?
→ sequential, buffered, channel-based, random access

who owns the external resource?
→ the opener usually closes it unless the contract transfers ownership

which boundaries must be explicit?
→ charset, size, partial operations, failure, compatibility, security
~~~

Good I/O design makes those decisions visible in code and adds complexity only when the problem actually requires it.
