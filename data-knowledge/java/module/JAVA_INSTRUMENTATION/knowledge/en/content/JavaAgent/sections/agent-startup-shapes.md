Three startup shapes matter:

| Shape | Manifest | Entry point | Timing |
| --- | --- | --- | --- |
| command-line agent | Premain-Class | premain | before application main |
| executable-JAR agent | Launcher-Agent-Class | agentmain | before application main |
| dynamic agent | Agent-Class | agentmain | after JVM startup |

The first two are **startup-time** mechanisms: deployment declares the agent before the application begins. A dynamic agent requires implementation support for attach/loading and is subject to increasingly explicit JDK policy.

Because both Launcher-Agent-Class and dynamic loading use agentmain, do not assume they have identical failure behavior or argument handling. Reason from the **launch path**, not only the method name.
