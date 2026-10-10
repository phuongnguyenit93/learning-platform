A JVM implementation may use native method stacks to support methods implemented in native code or other native runtime mechanisms.

The specification gives implementations freedom in how this resource is organized; an implementation that does not support native methods in that form may not need a distinct native method stack.

The JVM lesson here is simply that Java application execution can require stack/resources outside the JVM-frame model. JNI and FFM programming are owned by Native Interoperability.
