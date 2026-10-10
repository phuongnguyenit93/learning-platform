Java 21 defines four transformer groups in this order:

~~~text
1. Java retransformation-incapable transformers
2. native retransformation-incapable transformers
3. Java retransformation-capable transformers
4. native retransformation-capable transformers
~~~

Within each group, transformers run in registration order.

Therefore “registration order” is only globally true **inside a group**. A canRetransform=true transformer can be registered earlier than a canRetransform=false transformer yet still execute after the incapable group.

Native transformers come from the JVMTI ClassFileLoadHook and are mentioned only to complete the ordering model. Writing native/JVMTI agents remains outside this module.
