One dump shows one instant. To separate a transient state from a liveness problem, collect **several dumps at a short interval appropriate to the incident**.

Example:

~~~text
t0      thread A → same stack / same lock
t0+10s  thread A → same stack / same lock
t0+20s  thread A → same stack / same lock
~~~

If request threads preserve the same stack and lock relationships while traffic continues, the “stuck or blocked” hypothesis becomes stronger.

If stacks change continuously, work may still be progressing even though every isolated snapshot looks busy.

Repeated dumps should use the same PID, record timestamps, use a consistent interval, avoid excessive sampling, and be correlated with CPU/latency/logs from the same window.

When the problem needs a real timeline rather than manual snapshots, JFR is the natural next evidence source.
