Java Instrumentation is the mechanism that lets a **Java agent** participate when the JVM defines or changes classes. Its primary intervention point is bytecode: an agent can observe a class being defined and, when appropriate, supply different class-file bytes before the JVM installs the definition.

In Java SE 21, java.lang.instrument provides services for agents running on the JVM. The Instrumentation interface emphasizes the common benign case of **adding bytecode to gather data** for profilers, monitoring agents, coverage analyzers, and event loggers. The package contract also supports transforming classes at load time and, when the required capabilities exist, transforming already-loaded classes.

A useful mental model is:

~~~text
application class bytes
        ↓
JVM / class loading
        ↓
registered ClassFileTransformer
        ↓
original bytes or transformed bytes
        ↓
JVM verifies + links + installs class definition
~~~

Instrumentation exists because some logic must apply **across many classes without editing application source**. That is what makes it an advanced runtime topic: the code is no longer merely calling application APIs; it is participating in the lifecycle of JVM class definitions.
