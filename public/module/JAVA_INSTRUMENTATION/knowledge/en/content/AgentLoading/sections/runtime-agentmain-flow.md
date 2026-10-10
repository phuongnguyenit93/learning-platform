Dynamic loading occurs after the JVM/application has started. The agent JAR needs Agent-Class and the class must define agentmain:

~~~java
public static void agentmain(String agentArgs, Instrumentation inst) {
    if (!inst.isRetransformClassesSupported()) {
        throw new IllegalStateException("Retransformation is required");
    }
    inst.addTransformer(new TimingTransformer(), true);
}
~~~

Unlike a startup agent, a dynamic agent arrives **after** many classes may already be loaded. To affect them, it often must:

1. register an appropriately retransformation-capable transformer;
2. find target classes through getAllLoadedClasses();
3. check isModifiableClass();
4. call retransformClasses(), or use redefineClasses() when replacement bytes are the intended model.

Dynamic loading is useful for on-demand tooling, but it increases the importance of capability checks, rollback design, and attach policy.
