A class histogram reports instance count and total size grouped by class.

With jcmd:

~~~text
jcmd <pid> GC.class_histogram
~~~

Do not treat the word “histogram” as meaning “cheap.” In Java 21, `jcmd` documents `GC.class_histogram` as a **High impact** command whose cost depends on heap size and content. Before collecting it—especially before taking several histograms for comparison—check the target JVM, symptom window, and operational impact budget.

Histograms are useful for:

- finding classes with large instance counts or byte totals;
- comparing snapshots to identify growing populations;
- deciding whether a heap dump is justified.

A histogram does not show the full object graph or retention paths. A large class is not automatically leaking; it may represent a valid cache or current working set.

Useful pattern:

~~~text
histogram t1
   ↓
histogram t2
   ↓
which class population grows?
   ↓
heap dump / JFR / application context
~~~
