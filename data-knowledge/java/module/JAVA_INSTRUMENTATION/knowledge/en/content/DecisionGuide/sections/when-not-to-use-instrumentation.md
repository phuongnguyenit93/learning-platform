Avoid Instrumentation when a simpler, clearer mechanism is sufficient.

Examples:

- you own the source and only need metrics around a few methods → explicit decorator/interceptor may be simpler;
- a Spring bean call needs cross-cutting behavior → framework proxy/AOP may fit;
- you only need annotation/metadata inspection → Reflection;
- you need GC/thread/heap diagnosis → JFR/jcmd/Runtime Diagnostics;
- you need arbitrary object-schema/inheritance changes → redefine/retransform is insufficient;
- you need deep native VM events → JVMTI/native-agent boundary.

Anti-pattern:

~~~text
"I don't want to modify source"
→ therefore use a bytecode agent for everything
~~~

Hidden complexity includes class-loader problems, JDK compatibility, startup cost, and difficult debugging. Instrumentation should be a **deliberate infrastructure choice**, not a default shortcut.
