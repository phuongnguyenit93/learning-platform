For a startup agent passed on the command line:

~~~text
java -javaagent:timing-agent.jar=config=prod app.Main
~~~

the JVM reads Premain-Class from the manifest, loads the agent class, and invokes premain **before application main**.

~~~java
public static void premain(String agentArgs, Instrumentation inst) {
    inst.addTransformer(new TimingTransformer());
}
~~~

If multiple -javaagent options are present, premain methods run in command-line order. That can affect transformer registration order and dependencies between agents.

The advantage is deterministic deployment: the agent exists from the beginning and can observe application classes loaded later. The cost is deployment configuration, and startup failure can abort the JVM before application main runs.
