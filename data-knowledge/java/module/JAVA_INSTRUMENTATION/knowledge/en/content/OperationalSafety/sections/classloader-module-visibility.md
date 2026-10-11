ClassLoader/module visibility is a frequent production failure source.

Suppose a target is:

~~~text
plugin class
defined by PluginClassLoader
in named module plugin.foo
~~~

and transformed bytecode calls:

~~~text
AgentRuntime.record()
~~~

If AgentRuntime is visible only from the system loader, the target may fail to resolve the helper.

Possible designs include:

- a minimal bootstrap helper;
- helper injection into the target loader;
- appending a JAR to the appropriate loader search;
- redefineModule to add required reads/opens/exports.

Do not “solve” this by putting the whole agent JAR on bootstrap search. The API warns that bootstrap-search JARs should contain only classes/resources intended for bootstrap definition; collisions can cause IllegalAccessError and difficult failures.
