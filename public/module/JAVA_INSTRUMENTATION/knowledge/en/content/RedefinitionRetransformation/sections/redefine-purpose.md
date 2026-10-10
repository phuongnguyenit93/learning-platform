Redefinition replaces a class definition with **class-file bytes supplied by the caller**:

~~~java
byte[] replacement = loadCompiledReplacement();
ClassDefinition definition =
        new ClassDefinition(OrderService.class, replacement);

inst.redefineClasses(definition);
~~~

Mental model:

~~~text
caller already has replacement class bytes
        ↓
redefineClasses(...)
        ↓
registered transformers participate according to pipeline rules
        ↓
JVM verifies + installs new definition
~~~

A typical use case is fix-and-continue/debugging or tooling that already has a concrete replacement definition. The Java API explicitly points out that when the goal is to instrument existing class bytes, retransformClasses is often the better model.

Redefinition requires the manifest/JVM redefine capability.
