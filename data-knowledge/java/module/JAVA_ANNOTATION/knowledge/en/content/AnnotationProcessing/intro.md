# Compile-Time Annotation Processing

Runtime reflection asks questions after classes have been loaded. That is too late when invalid metadata should fail the build, boilerplate should be generated before execution, or an index/resource must exist as part of the compiled artifact.

```text
invalid metadata
→ report a compile-time error

source implies boilerplate
→ generate source before runtime

declarations imply an index/resource
→ generate the artifact during the build
```

Annotation processing solves that timing problem by operating during compilation. A processor can inspect annotated program elements and validate rules. Generated source/class files can participate in later compiler rounds; generated resources are build outputs rather than automatic new compiler roots.

Java's standard processing API is primarily in `javax.annotation.processing` and `javax.lang.model`. It models source/program structure through elements and types instead of requiring application classes to be loaded and executed.
