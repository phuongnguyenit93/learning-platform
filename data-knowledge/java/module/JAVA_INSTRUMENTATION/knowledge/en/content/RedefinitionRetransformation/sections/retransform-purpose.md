Retransformation is used to **run the transformation process again for an already-loaded class**.

~~~java
if (inst.isRetransformClassesSupported()
        && inst.isModifiableClass(OrderService.class)) {
    inst.retransformClasses(OrderService.class);
}
~~~

The agent does not pass replacement bytes to retransformClasses. The JVM builds the pipeline input from the appropriate initial/latest-redefinition bytes, reuses previous output from retransformation-incapable transformers, then invokes retransformation-capable transformers again.

“Initial bytes” are not a byte-for-byte promise of the original .class file. The API allows constant-pool layout/order to differ and some attributes to differ or be absent while bytecode references remain semantically corresponding. Transformation code should therefore reason from the class-file model rather than exact raw layout.

This fits dynamic configuration well:

~~~text
agent attaches
→ register retransformation-capable transformer
→ find already-loaded OrderService
→ retransform
→ timing probe appears
~~~

If configuration later changes, another retransformation can generate bytes representing the new desired instrumentation state, provided the transformation design supports it.
