An agent class does not implement a mandatory interface. Instead, the JVM looks for static methods with specification-defined signatures:

~~~java
public static void premain(String agentArgs, Instrumentation inst)

public static void agentmain(String agentArgs, Instrumentation inst)
~~~

One-argument String variants are also valid. If the Instrumentation-taking form exists, the JVM prefers it. That is how the agent receives the runtime capability handle during startup.

Important parts of the contract:

- the method must be public static;
- the method name depends on the launch path;
- initialization should normally complete and return promptly;
- long-running work should be managed explicitly instead of blocking premain/agentmain;
- exception behavior differs between startup and live-JVM loading.

There is no JVM-managed “agent object lifecycle” comparable to a dependency-injection bean. The practical lifecycle is defined by the static entry point and whatever state the agent creates.
