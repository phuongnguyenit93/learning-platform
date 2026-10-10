Compilers, JITs, and CPUs have execution optimization rights as long as the observed behavior complies with the Java Memory Model.

Therefore, programmers should not deduce:

```text
line 1 is on line 2 in source
→ Other Thread Definitely Observe Line 1 Before Line 2
```

if there is no corresponding synchronization rule between threads.

Example of a false message publication:

```java
int data = 0;
boolean ready = false;

Writer
data = 42;
ready = true;

reader
if (ready) {
    use(data);
}
```

There is no volatile/lock/other happens-before edge between writer and reader.

Such code has **Data Race**.

### Why doesn't the module create an endpoint that "definitely catches reordering"?

A stress test can sometimes observe strange outcomes and sometimes not.

But:

```text
No strange outcome can be observed
≠
code is guaranteed by JMM
```

Therefore, this chapter uses `volatile-publication` Like Positive Experiment: Instead of hunting for unwarranted behavior, we demonstrate how to create a clear guarantee.

**Final Thoughts** Multi-threaded correctness should be based on happens-before, not on the probability of "my machine is running correctly".
