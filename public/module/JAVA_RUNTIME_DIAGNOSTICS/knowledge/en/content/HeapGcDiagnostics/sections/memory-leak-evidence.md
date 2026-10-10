A memory-leak hypothesis can be built as a chain:

~~~text
symptom: memory grows
   ↓
does post-GC live set grow?
   ↓
which histogram populations grow?
   ↓
what retains those objects in the heap graph?
   ↓
which allocation or old-object evidence points to the code path?
~~~

Strong evidence often includes:

- object populations increasing over time;
- retained paths leading to a long-lived root;
- growth that workload does not explain;
- a live set that does not fall as expected after collection.

Do not blame class X merely because many X instances exist. The real issue may be a cache owner, listener, or other long-lived structure retaining them.

If growth is outside the Java heap, move to NMT/native-memory diagnostics.
