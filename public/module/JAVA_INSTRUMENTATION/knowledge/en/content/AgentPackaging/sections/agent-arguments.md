With -javaagent, the text after the equals sign is delivered to premain as **one String**:

~~~text
java -javaagent:timing-agent.jar=include=com.example,debug=true app.jar
~~~

The agent owns the format and parsing:

~~~java
public static void premain(String agentArgs, Instrumentation inst) {
    AgentConfig config = AgentConfig.parse(agentArgs);
}
~~~

Java does not define a standard configuration syntax for agentArgs. A production parser should:

- validate keys and values;
- provide safe defaults;
- avoid logging secrets;
- fail with useful diagnostics for malformed input;
- avoid accidental dependence on the working directory when paths are accepted.

For Launcher-Agent-Class, the package specification defines agentArgs as the empty string. That matters when the same agentmain implementation is reused.
