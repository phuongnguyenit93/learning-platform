The first step in every diagnostic action is proving that you are looking at the **correct JVM**. One host can run many Java processes, containers can have separate PID namespaces, and multiple service instances can have the same main class or JAR name.

Start with:

```bash
jcmd -l
```

or:

```bash
jps -lv
```

`jcmd -l` lists JVMs visible to the tool together with main-class and command-line information. `jps` provides a similar view of instrumented HotSpot JVMs. Do not treat either list as the only source of process identity. Oracle notes that a JVM running in a separate Docker process/namespace might not be visible in the expected way, so operating-system or container tooling may also be required.

Once you have a candidate PID, verify the target:

```bash
jcmd 12345 VM.version
jcmd 12345 VM.command_line
jcmd 12345 VM.flags
jcmd 12345 VM.system_properties
```

Before collecting expensive evidence, answer:

- is this the correct service instance;
- which JDK version/vendor is running;
- does the command line and flag set match the deployment under investigation;
- is this a host PID or a PID inside a container namespace;
- has the process restarted since the symptom occurred?

In orchestrated environments, tie the PID to **service instance + container/pod + host + time**. A file named `thread-dump-12345.txt` without an instance identity and timestamp is easy to misinterpret later.

A stronger artifact name is:

```text
orders-api_pod-7f9c_pid-12345_2026-10-02T08-15-30Z_threads.txt
```

Correct target identification is a very low-cost step with very high value. Every later conclusion is invalid if the evidence came from the wrong JVM.
