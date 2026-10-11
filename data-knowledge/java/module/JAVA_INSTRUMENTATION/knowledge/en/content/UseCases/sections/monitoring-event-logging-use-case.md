Monitoring/APM agents commonly instrument framework boundaries such as:

~~~text
HTTP handler
database client
message consumer
scheduled task
selected business operation
~~~

Probes may record:

- start/end time;
- status/error;
- endpoint/query category;
- correlation metadata;
- counters/histograms.

Event logging can similarly inject hooks where the application emits no event itself.

An important design concern is **cardinality and privacy**. Instrumentation may technically observe arguments/return values, but capturing everything is unsafe. Agents need policies that avoid secrets/PII and prevent high-cardinality labels.

A good monitoring agent improves observability with controlled overhead and boundaries; it does not turn every method into a log statement.
