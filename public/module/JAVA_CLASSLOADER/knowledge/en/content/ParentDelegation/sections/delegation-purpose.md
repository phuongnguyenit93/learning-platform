Parent-first lookup solves a consistency problem. If every loader freely redefined any class name it received, even widely shared API types could fragment into incompatible runtime identities.

Consider the plugin interface again. The host wants this cast to work:

```java
Object instance = pluginType.getDeclaredConstructor().newInstance();
Plugin plugin = (Plugin) instance;
```

That succeeds only if the plugin implementation implements the **same runtime `Plugin` type** that the host uses. Delegating the shared API to a common parent is a natural way to guarantee that identity.

Parent-first loading also protects consistency for Java platform classes. Application code should not be able to place its own `java.lang.String` earlier in a plugin directory and silently replace the runtime's foundational `String` class.

The benefits are therefore connected:

- **type consistency**: shared APIs resolve to one parent-owned runtime class;
- **predictable dependency sharing**: children naturally reuse dependencies visible to the parent;
- **platform integrity**: core Java types remain owned by the runtime's trusted loading boundary;
- **less duplicate metadata**: a child does not define another copy of every class its parent already provides.

Delegation is a lookup policy. It is not a guarantee that all class paths are globally unique, and it does not prevent a different, unrelated loader from defining the same binary name in another isolated namespace. That possibility is exactly why class identity includes the defining loader.
