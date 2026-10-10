The Instrumentation instance is a capability object provided by the JVM. Agent code does not construct or implement it; the API explicitly says Instrumentation is not intended for implementation outside java.instrument.

A minimal pattern looks like:

~~~java
public final class TimingAgent {
    private static volatile Instrumentation instrumentation;

    public static void premain(String args, Instrumentation inst) {
        instrumentation = inst;
        inst.addTransformer(new TimingTransformer());
    }
}
~~~

Once acquired, the instance can be retained and later used to:

- add/remove transformers;
- inspect loaded classes;
- query capabilities;
- request retransformation or redefinition;
- extend bootstrap/system class-loader search;
- expand module relationships with redefineModule.

This handoff is the bridge from “the JVM started my agent” to “the agent can interact with class definitions in this runtime.”
