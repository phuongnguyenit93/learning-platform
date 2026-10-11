Use-after-close happens when code keeps a MemorySegment or callback address beyond the lifetime of the resource that backs it.

FFM reduces this risk through temporal safety. A segment associated with a closeable Arena becomes invalid after that Arena is closed:

~~~java
Arena arena = Arena.ofConfined();
MemorySegment segment = arena.allocate(ValueLayout.JAVA_LONG);
arena.close();

segment.get(ValueLayout.JAVA_LONG, 0); // lifetime has ended
~~~

That Java-side check cannot protect native code that previously stored the raw address. If a native library keeps a pointer and later dereferences it after the Arena has closed, the fault is outside the segment's temporal-safety boundary.

Any API that “registers a pointer or callback for later” therefore needs a matching lifecycle protocol: keep the Arena alive, unregister successfully, and only then close the Arena.
