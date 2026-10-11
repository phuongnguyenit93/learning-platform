For Java-heap exhaustion, an important readiness option is:

~~~text
-XX:+HeapDumpOnOutOfMemoryError
~~~

When an eligible OutOfMemoryError occurs, HotSpot writes an HPROF heap dump without requiring an operator to attach in time. Use -XX:HeapDumpPath to control where that dump is written.

Linux/macOS shell example:

~~~text
java -XX:+HeapDumpOnOutOfMemoryError \
     -XX:HeapDumpPath=/var/log/java/app-%p.hprof \
     -jar app.jar
~~~

Keep **capture** separate from **analysis**:

- this postmortem chapter owns automatic capture and preservation at failure time;
- the Heap/GC chapter owns analyzing the resulting heap data for memory-growth and leak hypotheses.

Heap dumps can be large and writing them can cause a noticeable pause. Production readiness therefore includes disk capacity, a writable destination, and protection for sensitive data contained in the dump.
