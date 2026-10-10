An **MBean** exposes a management interface through JMX. An **MXBean** is an MBean variant whose types are mapped to a standard set of open types, which helps remote clients avoid depending on application-specific classes.

Every managed bean registered in an MBeanServer is identified by an **ObjectName**, conceptually:

~~~text
java.lang:type=Memory
java.lang:type=Threading
java.lang:type=GarbageCollector,name=<collector>
~~~

An ObjectName is a management identity made of a domain and key properties; it is not a Java object reference.

This matters because clients can query beans by name/pattern, access structured attributes/operations, and use the same management model locally or remotely.

You do not need the entire JMX instrumentation specification to use platform MXBeans, but MBean/ObjectName concepts make JConsole and remote JMX behavior much easier to understand.
