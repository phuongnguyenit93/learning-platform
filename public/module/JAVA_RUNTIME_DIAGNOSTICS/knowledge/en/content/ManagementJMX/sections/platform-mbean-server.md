The platform MBeanServer is the JVM's built-in registry of MBeans:

~~~java
MBeanServer server = ManagementFactory.getPlatformMBeanServer();
~~~

Platform MXBeans can be accessed in three common ways:

1. directly through ManagementFactory in the same JVM;
2. through a typed MXBean proxy backed by an MBeanServerConnection;
3. indirectly through MBeanServer/MBeanServerConnection and ObjectName.

Direct example:

~~~java
RuntimeMXBean runtime = ManagementFactory.getRuntimeMXBean();
System.out.println(runtime.getUptime());
~~~

A proxy is useful when code wants a typed interface while the actual target may be a remote JVM.

Applications can also register custom MBeans in the platform server. That broader instrumentation design is outside this module's main scope; here the server is primarily part of the diagnostic access path.
