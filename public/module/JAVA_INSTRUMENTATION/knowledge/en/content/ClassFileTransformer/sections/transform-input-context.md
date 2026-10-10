The callback provides enough context for an agent to decide whether the class should be touched:

- module: the module containing the class;
- loader: defining loader, null for the bootstrap loader;
- className: JVM internal-form name such as java/util/List;
- classBeingRedefined: null for initial load, non-null for redefine/retransform;
- protectionDomain: the class protection context;
- classfileBuffer: input bytes in class-file format.

className uses slashes rather than dots:

~~~java
if (className != null
        && className.startsWith("com/example/")) {
    // candidate
}
~~~

Do not target only by className in applications with multiple loaders. The same binary name defined by two different loaders represents two different Class objects. For complex agents, module + loader + className is a safer selection tuple.
