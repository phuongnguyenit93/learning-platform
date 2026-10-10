Not every runtime question requires shell access or a dump file. Java provides a standard **management API** that lets application code and management clients read JVM state through stable interfaces.

The management layer exists to:

- expose runtime state as managed objects;
- allow in-process or remote observation;
- provide selected management operations;
- decouple clients from concrete JVM implementation classes.

Mental model:

~~~text
JVM/runtime component
        ↓
platform MXBean / MBean
        ↓
MBeanServer / proxy / direct access
        ↓
application code, JConsole, JMC, or another management client
~~~

In Runtime Diagnostics, MXBeans/JMX are a **structured source of runtime evidence**. They complement rather than replace thread dumps, JFR, or heap dumps.
