A JVM is not required to support every Instrumentation capability. Important queries include:

~~~java
inst.isRedefineClassesSupported();
inst.isRetransformClassesSupported();
inst.isNativeMethodPrefixSupported();
~~~

Redefine/retransform support depends on both:

~~~text
agent manifest requests the capability
        +
JVM configuration supports it
        ↓
API reports true
~~~

These capability answers are stable for a JVM instance, but code should still query the API instead of hard-coding assumptions from one vendor/version.

Can-Set-Native-Method-Prefix and setNativeMethodPrefix() address a specialized use case: wrapping native methods by retrying native resolution with a prefix. It belongs to the Instrumentation surface, but deep native interop remains outside this module.
