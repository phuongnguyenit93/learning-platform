Common reasoning failures include:

**Treating one snapshot as proof**  
A RUNNABLE thread or one large object class does not establish root cause. Look for repetition, trend, and correlation.

**Confusing a metric with a mechanism**  
90% CPU reports utilization, not the responsible code path. 80% heap usage does not prove a leak.

**Collecting only evidence that supports the current idea**  
Every hypothesis should have a condition that would falsify it.

**Using expensive tools too early**  
Heap/core dumps may increase pause time, disk pressure, and incident risk.

**Losing process/time identity**  
Correct artifact type from the wrong PID or time interval leads to false conclusions.

**Restarting before preserving evidence**  
Many runtime states cannot be reconstructed after restart.

**Crossing ownership boundaries**  
Diagnostics observes and narrows the problem; detailed GC algorithms, JMM semantics, JNI mechanics, or instrumentation internals belong elsewhere.
