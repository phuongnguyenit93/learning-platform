One signal rarely proves a root cause. Correlate evidence by **the same PID, time window, and hypothesis**.

For high CPU:

- OS/container data confirms the CPU increase is real;
- repeated thread dumps show recurring stacks;
- JFR CPU samples identify hot code paths;
- GC events show whether collection is consuming the CPU;
- deployment/log timelines reveal changes immediately before the spike.

For memory:

- process RSS establishes total growth;
- heap/GC data determines whether Java heap explains it;
- histograms and heap dumps show object populations;
- NMT checks JVM-native categories;
- JFR allocation or old-object evidence helps locate growth sources.

Correlation does not mean putting everything on one dashboard. It means checking whether independent observations fit the same causal story.
