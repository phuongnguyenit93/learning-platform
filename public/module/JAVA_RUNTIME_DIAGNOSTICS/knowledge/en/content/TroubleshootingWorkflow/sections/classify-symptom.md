Before choosing a tool, classify the symptom broadly:

| Symptom | Useful first evidence |
| --- | --- |
| requests hang or stop progressing | thread dumps, JFR thread/lock events |
| high CPU | repeated thread evidence, JFR CPU samples |
| growing Java heap | GC logs, histograms, heap/JFR memory evidence |
| growing RSS with stable heap | NMT, OS memory view, native handoff |
| short latency spikes | JFR timeline, application-log correlation |
| JVM crash | hs_err, core, pre-crash JFR/logs |
| need remote runtime state | MXBeans/JMX |

This is not a deterministic lookup table. One symptom can have many causes. Classification simply chooses the first **evidence family** that can separate likely causes at reasonable cost.

Always record the time window, host/container, PID, Java version, and recent changes. Evidence from the wrong process or wrong interval is often worse than no evidence.
