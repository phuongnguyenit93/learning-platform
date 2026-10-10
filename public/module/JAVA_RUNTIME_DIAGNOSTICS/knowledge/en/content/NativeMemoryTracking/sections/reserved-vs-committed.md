NMT output commonly shows two values that answer different questions.

**Reserved**  
Virtual address space set aside for a purpose. Reservation does not mean all of that space is backed by physical memory.

**Committed**  
The portion of reserved space committed for use by the VM. It is generally closer to memory the VM may actively consume, but it is still not identical to process RSS.

Conceptual example:

~~~text
Java Heap (reserved=4096MB, committed=1024MB)
~~~

The JVM has reserved a larger address range for possible heap growth while only part is currently committed.

Do not sum reserved values and compare them directly to RSS. Compare committed categories over time and correlate them with OS-level memory.
