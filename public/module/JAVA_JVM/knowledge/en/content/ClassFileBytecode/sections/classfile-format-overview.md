A class file is a tightly specified binary representation. Each valid representation describes one class, interface, or module at a particular class-file format version.

At a high level it contains:

```text
magic + version
constant_pool
access_flags
this_class / super_class / interfaces
fields
methods
attributes
```

The `0xCAFEBABE` magic value identifies the format, while major/minor version values let the JVM determine whether the artifact uses a class-file version it supports.

A class file is not “compressed Java source.” It is a separate representation with its own vocabulary and constraints, designed specifically for JVM execution.
