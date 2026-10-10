The capability manifest entries do not simply turn on an API globally. They declare that the agent **needs** a capability:

~~~text
Can-Redefine-Classes
Can-Retransform-Classes
Can-Set-Native-Method-Prefix
~~~

The JVM must also support the requested capability. The safe pattern is:

~~~java
if (inst.isRetransformClassesSupported()) {
    inst.addTransformer(transformer, true);
}
~~~

Registering a retransformation-capable transformer when retransformation is not supported can fail with UnsupportedOperationException.

Keep this rule:

~~~text
manifest declaration
        +
JVM support
        ↓
runtime capability
~~~

Do not assume that behavior observed on one HotSpot version is guaranteed by every JVM implementation.
