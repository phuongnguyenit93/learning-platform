addTransformer() registers a transformer for future class definitions. The two-argument overload declares whether that transformer participates in retransformation:

~~~java
inst.addTransformer(transformer, false);
inst.addTransformer(retransformableTransformer, true);
~~~

Registration with canRetransform=true can fail when retransformation is unsupported.

The same transformer instance can technically be added more than once, but the API strongly discourages it because ordering and removal become harder to reason about. Prefer distinct instances when distinct registrations are required.

removeTransformer() removes the most recently added matching instance. It does not restore classes already transformed, and because class loading is multi-threaded, callbacks can still arrive after removal returns.

Use an explicit lifecycle:

~~~text
create
→ register
→ use
→ disable behavior if needed
→ remove registration
→ optionally retransform/redefine affected classes for restoration
~~~
