The plugin example makes the rule observable. Assume `demo.plugins.HelloPlugin` exists only in the plugin directory, so the application parent cannot load it itself. Create two independent custom loaders over the same bytes:

```java
ClassLoader parent = Plugin.class.getClassLoader();
Path source = Path.of("plugins/hello/classes");

ClassLoader loaderA = new PluginClassLoader(parent, source);
ClassLoader loaderB = new PluginClassLoader(parent, source);

Class<?> typeA = loaderA.loadClass("demo.plugins.HelloPlugin");
Class<?> typeB = loaderB.loadClass("demo.plugins.HelloPlugin");

System.out.println(typeA.getName().equals(typeB.getName())); // true
System.out.println(typeA == typeB);                         // false
System.out.println(typeA.getClassLoader() == loaderA);      // true
System.out.println(typeB.getClassLoader() == loaderB);      // true
```

The class bytes may be byte-for-byte identical. That still does not merge their identities because each loader defined its own runtime class.

This behavior is useful, not accidental. It allows two plugins, containers, or test environments to host isolated copies of implementation classes without forcing one global definition for the whole JVM.

Isolation has a cost: objects of one definition are not instances of the other definition.

```java
Object a = typeA.getDeclaredConstructor().newInstance();

System.out.println(typeA.isInstance(a)); // true
System.out.println(typeB.isInstance(a)); // false
```

When debugging a same-name type problem, print both `Class#getName()` and `Class#getClassLoader()`. The name alone can hide the cause.
