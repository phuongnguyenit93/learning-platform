Three manifest attributes select the agent class for three launch paths:

- **Premain-Class**: used with -javaagent; the JVM invokes premain before application main.
- **Agent-Class**: used when loading into a running JVM; the JVM invokes agentmain.
- **Launcher-Agent-Class**: used for an agent packaged in an executable JAR; the JVM invokes agentmain before application main.

One agent JAR may contain both Premain-Class and Agent-Class to support startup and dynamic loading.

Example:

~~~text
Manifest-Version: 1.0
Premain-Class: com.example.agent.TimingAgent
Agent-Class: com.example.agent.TimingAgent
Can-Retransform-Classes: true
~~~

A common trap is assuming Launcher-Agent-Class means dynamic attach because it also calls agentmain. It is still an executable-JAR startup path.
