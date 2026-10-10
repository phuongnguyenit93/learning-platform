An optimizer may change **how** a program executes but not the observable behavior required by Java/JVM contracts.

Therefore:

- a source-level object may not exist physically as expected;
- a method may be inlined;
- machine-level instruction order can differ from the naive source mental model within semantic constraints;
- compiled code may be discarded and rebuilt.

Application correctness must not depend on implementation accidents such as “this method is always inlined” or “this object is definitely stack allocated.”

Write code according to language/JMM semantics and use profiling or benchmarking when you need evidence about actual runtime optimization.
