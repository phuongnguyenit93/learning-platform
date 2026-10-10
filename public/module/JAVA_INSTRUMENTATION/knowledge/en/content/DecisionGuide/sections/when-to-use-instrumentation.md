Instrumentation fits when the requirement lives at the **class-definition/runtime boundary**, not merely in ordinary business APIs.

Signals include:

- cross-cutting probes across many classes without editing source;
- instrumenting dependency/framework code;
- applying logic at class-load time;
- changing method implementation of loaded classes within JVM limits;
- enforcing an agent policy across applications/modules.

Checklist:

~~~text
can source modification/proxy solve it?
        ↓ no
need class-load or bytecode-level interception?
        ↓ yes
can accept a privileged in-process agent?
        ↓ yes
can test JDK/class-loader/module compatibility?
        ↓ yes
Instrumentation is a reasonable candidate
~~~

Do not choose it merely because “agents are powerful.” Choose it because the problem belongs to the boundary Instrumentation owns.
