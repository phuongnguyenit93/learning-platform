Process memory can increase for reasons independent of the live Java heap:

- more platform threads;
- more loaded classes/class loaders;
- JIT compilation and code-cache growth;
- direct buffers;
- JNI/native libraries;
- runtime internal structures;
- allocator fragmentation or committed-but-currently-unused memory.

So this pattern is not contradictory:

```text
heap used: stable
RSS: rising
```

At that point the right question is no longer only “heap leak?” but “which memory category is growing?” NMT/OS evidence belongs to Runtime Diagnostics.
