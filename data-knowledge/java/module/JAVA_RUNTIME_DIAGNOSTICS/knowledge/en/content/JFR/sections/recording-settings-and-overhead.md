The JDK includes common JFR configurations:

- **default.jfc**: a low-overhead event set suitable for continuous recording;
- **profile.jfc**: collects more data for shorter, deeper profiling sessions.

`default.jfc` is designed for low overhead and continuous recording. Do not assume one fixed `JFR.start` impact label across all JDK 21 updates: the Oracle Java 21 man page describes the command as Low impact, while some current JDK 21 update builds (for example 21.0.9) report Medium because recording settings can range from low to high impact. Treat `jcmd <pid> help JFR.start` on the **target JVM** as the runtime contract. Real overhead still depends on enabled events, thresholds, stack traces, and workload.

Important choices include:

- recording duration versus continuous operation;
- disk=true/false;
- maxage and maxsize for bounded retention;
- event thresholds;
- whether stack traces are needed;
- enable GC-root path collection only when leak analysis requires it, because the work can add significant cost or pauses. The option spelling is version/tool-surface sensitive: the Oracle Java 21 `jcmd` man page documents `path-to-gc-root` (singular), while some current JDK 21 update builds such as 21.0.9 expose `path-to-gc-roots` (plural). Always check `jcmd <pid> help JFR.start` on the target JVM before using it.

Start with low-overhead/default evidence and increase detail only when the current question remains unanswered.
