When native memory grows, ask **which category grows and whether that growth matches workload behavior**.

Examples:

- **Thread** grows with the number of platform threads → inspect thread creation and stack sizing;
- **Class** grows with dynamic loading → inspect class-loader lifecycle;
- **Code** grows during warm-up → JIT/code-cache activity may explain it;
- **GC/Internal** grows → deeper JVM interpretation may be needed;
- NMT stays flat while RSS grows → memory outside HotSpot tracking becomes more likely.

Useful reasoning:

~~~text
OS RSS trend
   + NMT summary.diff
        ↓
identify the growing category
        ↓
correlate with thread/class/JFR/application behavior
        ↓
choose JVM, native, or application handoff
~~~

NMT narrows the search space; it rarely names the final leaking function or object by itself.
