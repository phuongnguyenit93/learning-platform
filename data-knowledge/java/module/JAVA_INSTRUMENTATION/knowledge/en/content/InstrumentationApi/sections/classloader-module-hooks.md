Instrumentation exposes two families of visibility hooks.

**Class-loader search**

- appendToBootstrapClassLoaderSearch(JarFile)
- appendToSystemClassLoaderSearch(JarFile)

These can make agent helpers available through the appropriate loader search path. Bootstrap helpers have especially strict visibility constraints: code defined by the bootstrap loader must link only to classes visible to that loader.

**Module adjustment**

redefineModule() can **expand** an existing module by adding reads, exports, opens, uses, and provides. It is not a general-purpose API for arbitrarily rebuilding or shrinking the module graph.

An agent can check isModifiableModule(module) first. Unnamed modules report as modifiable, but redefining an unnamed module is a no-op; named modules are where expanding reads/exports/opens is typically meaningful.

The Java agent package contract also supports a common helper-call case: the JVM arranges for the module of a transformed class to read the unnamed modules of the bootstrap and system class loaders. That support does not automatically solve every exports/opens or helper-dependency problem, so the agent must still reason about the concrete loader and module boundary.

Mental model:

~~~text
transformed class needs a helper
        ↓
helper must be visible across loader/module boundaries
        ↓
search-path hook and/or redefineModule
        ↓
expand only what the instrumentation requires
~~~

This section assumes basic JPMS knowledge; deep readability/exports/opens semantics belong to the Java 9 Module System curriculum.
