`ByteBuffer.allocateDirect` creates a **direct byte buffer**. The Java API contract does not simply define “direct” as “off-heap”; it states that the JVM will make a best effort to perform native I/O directly on the buffer and avoid intermediate copying where possible. HotSpot commonly backs direct-buffer contents with native memory, so that footprint may not appear as ordinary Java-heap usage.

```java
ByteBuffer buffer = ByteBuffer.allocateDirect(1 << 20);
```

“Off-heap” is a broad label: not all native memory is a direct buffer, and different off-heap mechanisms have different ownership/lifetime rules.

The practical lesson is:

```text
heap monitoring
→ does not describe all application memory
```

JNI/FFM native-memory programming belongs to Native Interoperability.
