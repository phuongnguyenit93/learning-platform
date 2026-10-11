Launcher-Agent-Class is used by an executable JAR:

~~~text
java -jar application.jar
~~~

If the JAR manifest contains:

~~~text
Main-Class: com.example.Main
Launcher-Agent-Class: com.example.agent.BootAgent
~~~

the JVM loads BootAgent and invokes agentmain before Main.main().

Compared with -javaagent:

- it invokes agentmain rather than premain;
- agentArgs is always an empty string;
- the agent is packaged in the executable JAR;
- failure to initialize the agent can abort the JVM before application main.

This is still a **startup agent** even though the method is called agentmain. Therefore “premain means startup, agentmain means dynamic” is not a reliable rule.
