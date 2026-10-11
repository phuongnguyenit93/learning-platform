Heap/GC diagnostics answers questions such as:

- why does heap usage keep growing?
- is an OutOfMemoryError caused by heap pressure or something else?
- is allocation rate unusually high?
- is GC running too frequently?
- are objects being retained longer than expected?

Keep **JVM mechanics** separate from **diagnostic evidence**. The JVM module owns heap layout, collectors, and allocation mechanics; this chapter focuses on using histograms, heap dumps, GC logs, and JFR to test hypotheses.

~~~text
memory symptom
   ↓
heap usage + GC behavior
   ↓
histogram / heap dump / JFR
   ↓
retention or allocation hypothesis
~~~
