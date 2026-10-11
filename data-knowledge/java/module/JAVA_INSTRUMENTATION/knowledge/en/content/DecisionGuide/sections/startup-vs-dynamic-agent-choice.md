Choose a startup agent when the requirement is known before deployment:

- always-on observability;
- coverage during tests;
- mandatory security/runtime policy;
- need to observe early class loading;
- desire explicit deployer opt-in.

Choose dynamic attach when:

- investigating on demand;
- tooling must attach to an already-running process;
- restart is not immediately possible;
- instrumentation is temporary.

Comparison:

| | Startup | Dynamic |
| --- | --- | --- |
| policy | explicit at JVM launch | runtime mutation after launch |
| early classes | visible from the start | may need retransformation |
| failure | can abort startup | target JVM generally continues |
| JDK direction | stable deployment model | increasingly explicit policy |

If an agent is a permanent production dependency, startup loading is usually easier to reason about and audit.
