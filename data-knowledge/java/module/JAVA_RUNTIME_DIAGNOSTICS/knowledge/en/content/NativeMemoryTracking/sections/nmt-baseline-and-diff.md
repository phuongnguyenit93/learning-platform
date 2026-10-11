NMT is most useful as a **trend** tool.

Create a baseline at a point that matches the diagnostic question:

~~~text
jcmd <pid> VM.native_memory baseline
~~~

Later compare:

~~~text
jcmd <pid> VM.native_memory summary.diff
jcmd <pid> VM.native_memory detail.diff
~~~

For steady-state growth analysis, a practical workflow is:

1. let the JVM reach a representative post-warm-up state;
2. create a baseline;
3. wait through a meaningful workload/time window;
4. inspect summary.diff;
5. move to detail or another evidence source only for suspicious categories.

A startup baseline can be useful when the investigation needs to measure growth from early JVM life, while a post-warm-up baseline is usually easier to interpret for steady-state leak analysis. Choose the baseline according to the period you intend to compare rather than treating one timing as universally correct.
