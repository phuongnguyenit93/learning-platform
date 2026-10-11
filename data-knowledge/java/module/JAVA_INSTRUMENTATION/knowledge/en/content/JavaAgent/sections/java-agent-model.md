A Java agent is a Java component started through a JVM-defined contract so it can perform work before or while an application runs. Unlike a normal library, application code does not necessarily call the agent. The JVM invokes the agent entry point and can provide an Instrumentation instance.

Mental model:

~~~text
agent JAR
  ↓ manifest selects agent class
agent class
  ↓ premain or agentmain
Instrumentation instance
  ↓
register transformer / inspect loaded classes / request retransform-redefine
~~~

An agent usually lives inside the same process as the application. A bug, deadlock, memory leak, or dependency conflict in the agent can therefore affect the application directly. Treat the agent as **in-process runtime infrastructure**, not as an isolated service.
