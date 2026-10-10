The runtime must retain metadata for loaded classes: type information, field/method structures, and other state required for class lifecycle and execution.

Modern HotSpot commonly stores much of this class metadata in **Metaspace**, which uses native memory rather than ordinary Java object heap.

Practical consequences include:

- loading many distinct classes/class loaders can increase native memory;
- unloading depends on class-loader reachability/lifecycle;
- a healthy Java heap does not rule out class-metadata pressure.

Diagnosing class-loader leaks belongs to Class Loading/Runtime Diagnostics. Here the goal is recognizing class metadata as a non-heap contributor.
