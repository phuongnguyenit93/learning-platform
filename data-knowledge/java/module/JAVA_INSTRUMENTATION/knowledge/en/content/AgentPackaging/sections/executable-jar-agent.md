An executable JAR may package both the application main class and a Java agent. Launcher-Agent-Class tells the JVM which agent should run **before application main**.

Example manifest:

~~~text
Main-Class: com.example.app.Main
Launcher-Agent-Class: com.example.agent.BootAgent
~~~

The JVM invokes:

~~~java
public static void agentmain(String agentArgs, Instrumentation inst)
~~~

before application main; for this launch path, agentArgs is an empty string.

This is useful when an application wants a built-in startup agent without requiring an operator to add -javaagent. The trade-off is tighter deployment coupling: the application artifact now contains a privileged runtime component whose trust, versioning, and failure behavior must be reviewed as part of startup.
