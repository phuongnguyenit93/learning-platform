A strong diagnostic process keeps three things separate: **what was observed**, **the hypothesis that explains it**, and **the root cause**.

For example:

```text
Observation:
  p95 latency rises from 100 ms to 4 s

Hypothesis A:
  many request threads are waiting on the same lock

Hypothesis B:
  long GC pauses are stopping progress

Hypothesis C:
  downstream I/O is slow
```

None of these hypotheses is a conclusion yet. You need evidence that can distinguish them: repeated thread dumps for A, GC logs or JFR for B, and stack plus I/O evidence for C.

A practical reasoning loop usually looks like this:

1. **Define the symptom and its time window** — when did it happen, for which requests, for how long, and does it repeat?
2. **Narrow the subsystem** — thread/liveness, Java heap, GC, native memory, CPU, I/O, or crash.
3. **State a falsifiable hypothesis** — for example, “worker threads are waiting on the same monitor,” rather than “Java is hung.”
4. **Choose the cheapest evidence that can distinguish competing hypotheses.**
5. **Collect and correlate over time** — do not rely on one snapshot for a trend problem.
6. **Update the hypothesis** — discard it when the data does not fit instead of forcing the evidence to match the initial guess.
7. **Confirm the cause with behavior that can be rechecked** — after a fix, the related signal should change in the predicted direction.

“The heap is almost full” is not yet a root cause. “An unbounded cache retains millions of entries that are no longer useful, causing the live set to grow across load cycles” is a much more specific hypothesis that can be tested with histograms, heap dumps, and trends.

Always preserve a **timeline**. A thread dump at 10:01, a GC pause at 10:01:03, and a latency spike at 10:01:03 provide stronger evidence than three artifacts with no temporal relationship.
