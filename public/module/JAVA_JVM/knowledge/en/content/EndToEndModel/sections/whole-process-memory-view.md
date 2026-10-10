A production JVM process is the sum of multiple memory/resource categories:

```text
managed heap
+ thread/native stacks
+ class metadata
+ compiled code/code cache
+ direct/off-heap buffers
+ native libraries/runtime internals
= process footprint
```

Heap tuning affects only one part of that total. Thread explosion, a class-loader leak, or native-buffer growth can create memory pressure independently of heap occupancy.

The whole-process view prevents the common mistake “heap graphs look fine, therefore there cannot be a memory problem.”
