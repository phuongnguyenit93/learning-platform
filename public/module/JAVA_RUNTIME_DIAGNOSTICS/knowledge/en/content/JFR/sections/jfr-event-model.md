JFR records **typed events**, not one uniform text log. Event types represent behaviors such as CPU samples, allocation, GC phases, file/socket I/O, monitor contention, thread parks, exceptions, and virtual-thread activity.

An event may contain:

- timestamp;
- duration or instant semantics;
- related thread;
- event-specific fields;
- a stack trace when configured.

Do not enable every event simply because it exists. Start from the hypothesis:

~~~text
high CPU
→ execution / CPU sample events

lock contention
→ monitor / park / thread events

memory growth
→ allocation / GC / old-object evidence

I/O latency
→ socket / file events
~~~

For Java 21 virtual threads:

- `jdk.VirtualThreadPinned` is enabled by default with a 20 ms threshold;
- `jdk.VirtualThreadSubmitFailed` is enabled by default;
- `jdk.VirtualThreadStart` and `jdk.VirtualThreadEnd` are disabled by default and should be enabled when lifecycle visibility is actually needed.
