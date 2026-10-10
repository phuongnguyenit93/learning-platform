Redefine/retransform changes the **class definition**, not the identity/state of existing objects.

The Java API specifies that:

- existing instances are not replaced;
- static variables retain their values;
- class initialization does not rerun merely because of redefine/retransform.

Suppose OrderService has:

~~~java
static int requestCount = 42;
private final String region = "ap-southeast";
~~~

Retransforming method bodies does not reset requestCount to zero or rerun constructors for existing OrderService objects.

This helps explain why structural modification is tightly restricted: the JVM must preserve class/object identity and existing state while method implementation may change.

If a tool needs to migrate object schema/state, Java Instrumentation redefine/retransform is not the right mechanism.
