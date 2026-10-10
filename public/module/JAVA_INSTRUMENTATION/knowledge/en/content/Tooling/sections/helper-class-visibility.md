A transformation often injects a call to a helper:

~~~text
OrderService.placeOrder()
→ AgentRuntime.onEnter()
→ AgentRuntime.onExit()
~~~

The target class can call that helper only if it is visible/linkable from the target's defining loader/module.

Common strategies include:

- a bootstrap helper JAR via appendToBootstrapClassLoaderSearch;
- helpers on the system/application loader when appropriate;
- auxiliary classes injected into a particular loader;
- redefineModule to add required reads/opens/exports.

A classic pitfall is the same Helper name defined by two class loaders, producing different type identities.

Therefore “the bytecode contains the correct INVOKESTATIC” is not enough. Ask:

~~~text
which loader will resolve the helper?
does the module have the required read/open/export relationship?
are the helper's own dependencies visible?
~~~
