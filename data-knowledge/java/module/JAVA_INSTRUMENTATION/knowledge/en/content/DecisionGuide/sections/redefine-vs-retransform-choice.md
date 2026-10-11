Choose according to where the desired bytes come from:

~~~text
have concrete replacement class bytes?
→ redefineClasses

want the transformer pipeline to recompute instrumentation?
→ retransformClasses
~~~

Retransform fits:

- enabling/disabling probes;
- dynamic configuration;
- attaching after classes are already loaded;
- applying existing transformer logic to loaded classes.

Redefine fits:

- debugger/fix-and-continue style replacement;
- tools that already compiled/generated a full replacement definition.

Both:

- require JVM capability;
- require a modifiable class;
- obey structural limits;
- do not reset object/static state;
- allow active frames to continue old code.

Choose by semantics, not merely by which API is available.
