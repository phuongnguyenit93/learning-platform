HotSpot also has runtime-compiler policy: which code is considered hot, which compilation level should be used, when code should be recompiled or deoptimized, and how compiler resources are spent.

Tiered compilation is commonly used in modern HotSpot because it balances startup, profiling quality, and peak performance.

Applications normally should not manipulate compiler thresholds as a first tuning step. These controls are implementation-sensitive and can make benchmarks behave very differently from production.

Compiler tuning only makes sense when profiling shows that compilation, warm-up, or code-cache behavior is actually relevant to the bottleneck.
