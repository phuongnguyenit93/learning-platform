# Virtual Thread in Java 2.

Virtual Thread is lightweight `Thread` implementation is managed by the JVM to help the thread-per-task scale model better for workloads with a lot of timeout/blocking.

It does not change the learned rules of correctness:

```text
Race condition still exists
volatile/JMM still exists
Lock still needed when shared mutable state needs protection
Deadlock can still happen
```
