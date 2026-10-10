The JDK includes the **jfr CLI** for inspecting recordings without a GUI:

~~~text
jfr summary recording.jfr
jfr print recording.jfr
jfr print --events <event-list> recording.jfr
jfr metadata recording.jfr
~~~

The CLI works well for automation, quick inspection, and reproducible filtering.

**JDK Mission Control (JMC)** provides richer visualization, time-range selection, automated analysis, hot methods, memory views, and event correlation. JMC is companion tooling in the JDK ecosystem and should not be assumed to be bundled with every runtime installation.

Keep the roles separate:

- JFR = event-recording mechanism;
- jcmd / StartFlightRecording = recording control;
- jfr CLI = file inspection;
- JMC = visualization and analysis UI.

Learning JFR does not require learning every JMC feature. This module focuses on using recordings as diagnostic evidence.
