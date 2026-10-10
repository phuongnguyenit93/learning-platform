The jdk.attach module provides APIs for a tool to connect to another JVM and request operations such as agent loading. Mental model:

~~~text
diagnostic / tooling process
        ↓
VirtualMachine.attach(target)
        ↓
request agent loading
        ↓
target JVM loads agent JAR
        ↓
Agent-Class.agentmain(...)
~~~

The Attach API is a **tooling boundary**, not part of java.lang.instrument itself. java.lang.instrument defines the agent lifecycle; jdk.attach is one JDK mechanism that can initiate that lifecycle in a running JVM.

Attach can be restricted by OS/user permissions, JVM options, containers/process environment, or implementation policy. Knowing a PID does not imply that attachment will succeed.

Production tooling should separate the two failure domains: attach/tool-process failure and agent-initialization failure inside the target JVM.
