`jcmd` is the general command-line interface for sending **diagnostic commands** to a running JVM. On modern JDKs, Oracle recommends preferring `jcmd` over older utilities such as `jstack`, `jmap`, and `jinfo` when an equivalent `jcmd` operation exists.

A basic workflow is:

```bash
# List JVMs
jcmd -l

# Discover commands supported by the target JVM
jcmd 12345 help

# Inspect syntax and impact for one command
jcmd 12345 help Thread.print

# Common low-level questions
jcmd 12345 VM.version
jcmd 12345 VM.command_line
jcmd 12345 VM.flags
jcmd 12345 VM.system_properties
jcmd 12345 GC.heap_info
jcmd 12345 Thread.print -l
```

The available command set can vary by JVM build and version, so `jcmd <pid> help` against the **actual target** is more reliable than memorizing a static list.

`jcmd` is also an entry point for important diagnostic artifacts:

```bash
# Class histogram
jcmd 12345 GC.class_histogram

# HPROF heap dump
jcmd 12345 GC.heap_dump /diagnostics/heap.hprof

# Traditional thread dump for platform-thread-oriented evidence
jcmd 12345 Thread.print -l

# Virtual-thread-aware dump in Java 21
jcmd 12345 Thread.dump_to_file -format=json /diagnostics/threads.json
```

One tool does not mean one impact level. Oracle documents `VM.flags` as low impact, `Thread.print` as medium impact depending on the number of threads, and `GC.class_histogram` and `GC.heap_dump` as potentially high impact depending on heap size and content.

The correct usage model is:

```text
diagnostic question
    ↓
jcmd <pid> help
    ↓
choose a command that can answer it
    ↓
review impact + prepare output
    ↓
collect evidence
```

`jcmd` is a convenient control surface. It does not replace understanding the artifact produced by each command.
