The manifest connects a JAR to the agent lifecycle. Important attributes include:

~~~text
Premain-Class
Agent-Class
Launcher-Agent-Class
Can-Redefine-Classes
Can-Retransform-Classes
Can-Set-Native-Method-Prefix
Boot-Class-Path
~~~

Not every agent needs every attribute. A minimal -javaagent startup agent may only need Premain-Class. If the agent intends to call retransformClasses, the manifest must request Can-Retransform-Classes: true and the JVM must also support that capability.

The manifest is a **declaration of intent**, not an unconditional guarantee. Runtime code should still query Instrumentation before using optional capabilities.
