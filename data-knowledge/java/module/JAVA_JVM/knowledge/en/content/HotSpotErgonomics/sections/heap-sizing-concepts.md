Heap sizing controls how much memory the managed heap can use. In the Java 21 launcher, `-Xms` sets the **minimum and initial heap size**, while `-Xmx` sets the **maximum heap size**.

Trade-offs include:

- too little heap → more frequent collection and allocation pressure;
- more heap → more headroom, but a larger footprint and potentially different pause behavior;
- `-Xmx` limits the heap, **not the entire JVM process**.

Inside a container, think in terms of:

```text
container memory limit
> heap
+ thread stacks
+ class metadata
+ code cache
+ direct/native memory
+ native libraries/runtime overhead
```

Giving nearly the whole container limit to the Java heap leaves no room for the rest of the process.
