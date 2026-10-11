JDK 21 implements the direction described by JEP 451: when an agent is loaded dynamically into a running JVM, the JVM emits a warning in preparation for a future release where dynamic loading may be disabled by default.

On HotSpot JDK 21:

- dynamic agent loading remains allowed by default;
- the JVM emits a warning on dynamic loading;
- -XX:+EnableDynamicAgentLoading is an explicit opt-in and suppresses the warning;
- -XX:-EnableDynamicAgentLoading can disable dynamic loading.

The design lesson matters more than memorizing flags:

~~~text
startup instrumentation
→ deployment owner explicitly opts in at JVM start

dynamic instrumentation
→ runtime changes after startup
→ should face stricter policy/authorization
~~~

Prefer startup loading when instrumentation is known in advance. Dynamic attach remains valuable for on-demand diagnostics/tooling, but it should not be treated as an unrestricted permanent capability.
