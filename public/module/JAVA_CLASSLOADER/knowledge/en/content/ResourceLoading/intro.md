# Classpath Resource Loading

Class loaders are also used to locate **resources** such as configuration files, templates, service descriptors, and bundled data. Resource lookup is related to class lookup because it often uses the same loader hierarchy, but a resource is not a Java type: finding `plugin.properties` does not define a `Class<?>`, participate in type identity, or trigger class initialization.

This chapter uses `URL`, `InputStream`, `Path`, and try-with-resources as observation tools. If those I/O APIs are unfamiliar, keep only the model that a resource can be located and read as a stream; detailed stream/file semantics belong to the `io` module.

The main source of mistakes is path semantics. `Class.getResource` can be package-relative, while `ClassLoader.getResource` treats names from the loader's resource root and normally expects no leading `/`.
