Failure behavior depends on the launch path:

| Path | Agent initialization failure |
| --- | --- |
| -javaagent / premain | JVM aborts before application main |
| Launcher-Agent-Class | JVM aborts before application main |
| running JVM / agentmain | target JVM does not abort; failure may be ignored/logged |

This affects design:

- a startup agent can fail fast when instrumentation is mandatory;
- a dynamic agent must report status back to the tool/operator because the application continues;
- initialization should be idempotent or guarded if a tool can attach repeatedly;
- partial initialization state should be cleaned up when possible.

Do not reuse one error-handling strategy for premain and agentmain without considering the actual launch path.
