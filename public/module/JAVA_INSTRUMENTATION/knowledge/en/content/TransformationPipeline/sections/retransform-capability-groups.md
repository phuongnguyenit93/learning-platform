During retransformClasses(), the two Java transformer groups behave very differently.

**canRetransform=false**

- transform() is **not invoked again**;
- the JVM reuses the output produced at the previous load/redefine;
- that previous effect is automatically reapplied.

**canRetransform=true**

- transform() is invoked again;
- input already includes the automatically reused incapable-transformer effects;
- output can change according to current agent configuration/state.

Mental model:

~~~text
initial / latest redefine bytes
        ↓
reuse previous output of non-retransformable transformers
        ↓
invoke retransformable transformers again
        ↓
verify + install
~~~

That is why retransformation capability is chosen when addTransformer is called, not when retransformClasses is requested.
