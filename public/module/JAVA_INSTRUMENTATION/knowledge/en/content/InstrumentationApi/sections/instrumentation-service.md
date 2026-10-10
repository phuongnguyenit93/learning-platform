Instrumentation is the JVM-provided facade through which an agent works with class definitions. Rather than calling low-level native tooling hooks directly, an agent gets a Java control surface for:

- registering/removing ClassFileTransformer instances;
- inspecting loaded classes;
- checking class/module modifiability;
- querying redefine/retransform/native-prefix support;
- requesting retransform/redefine;
- extending class-loader search;
- expanding module relationships;
- obtaining an implementation-specific object-size estimate.

Instrumentation is not a global utility singleton. The agent receives an instance through premain/agentmain and should treat it as the capability handle for the current JVM.

~~~java
public static void premain(String args, Instrumentation inst) {
    System.out.println("Loaded classes: " + inst.getAllLoadedClasses().length);
}
~~~

This API is the control surface; bytecode engineering remains the responsibility of the transformer/tooling layer.

One supporting method is easy to overinterpret: getObjectSize(object) returns an **implementation-specific approximation** of storage consumed by that object. It is not a deep size for the entire object graph, should not be used as an absolute cross-JVM comparison, and the estimate may even change during one JVM invocation.
