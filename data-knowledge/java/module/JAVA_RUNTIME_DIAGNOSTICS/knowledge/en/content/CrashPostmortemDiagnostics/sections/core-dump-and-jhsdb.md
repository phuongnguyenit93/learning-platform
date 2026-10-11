A **core dump** is an operating-system snapshot of process memory at a crash or explicit capture point. It preserves far more state than a text log and is valuable for native/VM postmortem analysis.

The JDK's **jhsdb** tools use the Serviceability Agent to inspect HotSpot state from a core dump or, in some modes, a process. Examples include:

~~~text
jhsdb jstack --exe <java-executable> --core <core-file>
jhsdb jmap   --histo --exe <java-executable> --core <core-file>
~~~

Core analysis works best with the matching Java executable/JDK build and appropriate native symbols. `jhsdb` is **experimental and unsupported**. The Java 21 documentation warns that attaching it to a live process **will cause the process to hang** and that the process **will probably crash when the debugger detaches**. Do not use Serviceability Agent attachment for ordinary live diagnostics; prefer jcmd, JFR, or JMX while the JVM is healthy enough to respond.

Core files can also contain sensitive application data because they reflect process memory. Storage, transfer, and retention should be controlled accordingly.
