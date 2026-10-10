The transformation pipeline can be triggered by three kinds of operation:

~~~text
new class definition
→ ClassLoader.defineClass or native equivalent

class redefinition
→ Instrumentation.redefineClasses

class retransformation
→ Instrumentation.retransformClasses
~~~

In all three cases transformers run before the resulting definition is applied by the JVM. However, **the input bytes and the set of invoked transformers differ**.

For first load, input originates from bytes passed to defineClass. For redefine, input comes from the ClassDefinition supplied by the caller. For retransform, the JVM starts from the appropriate initial/redefined bytes, automatically reapplies prior results of retransformation-incapable transformers, then invokes retransformation-capable transformers.

When debugging a pipeline, first ask: **is this a load, redefine, or retransform?**
