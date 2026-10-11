One large snapshot does not prove a leak. A leak is a **retention-over-time** problem.

Example:

~~~text
t1 post-GC heap = 500 MB
t2 post-GC heap = 700 MB
t3 post-GC heap = 950 MB
~~~

If workload is comparable and the live set grows steadily, further investigation is justified.

Trend evidence can come from:

- GC logs;
- JMX/MXBeans;
- JFR;
- repeated histograms;
- monitoring metrics.

Those sources do not have equal collection cost. In particular, repeated `GC.class_histogram` calls still repeat a command documented as **High impact** depending on heap size/content. Use repeated histograms only when their diagnostic value justifies that cost; otherwise prefer lower-impact time-series evidence such as existing GC logs, JFR, management data, or monitoring metrics.

A heap dump gives detailed object structure but only at one point in time. Multiple dumps may provide stronger evidence but at higher operational cost.

Always correlate with workload, deployments, and traffic. Legitimate data growth is not a leak.
