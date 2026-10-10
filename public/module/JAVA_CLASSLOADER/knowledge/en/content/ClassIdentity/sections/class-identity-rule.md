For runtime class identity, think in terms of this pair:

```text
(binary class name, defining ClassLoader)
```

If both components are the same, the JVM is referring to the same runtime class identity. If the binary name is the same but the defining loaders differ, the runtime types differ.

```text
(demo.plugins.HelloPlugin, loader A)
≠
(demo.plugins.HelloPlugin, loader B)
```

The Parent Delegation chapter established the difference between initiating and defining loader roles. For runtime type identity, the defining ClassLoader is the role that matters here.

You can inspect the relationship directly:

```java
Class<?> type = ...;

System.out.println(type.getName());
System.out.println(type.getClassLoader());
System.out.println(type.getModule());
```

The Java Platform Module System adds another visibility and encapsulation layer, but it does not remove ClassLoader identity. Modules and loaders answer related, different questions: a module expresses module membership/readability/export rules; the defining loader remains part of the JVM's runtime type identity.

The same loader-sensitive idea also affects runtime packages. Package-private access is not granted merely by matching package text; classes must belong to the same runtime package boundary, which includes defining-loader identity.

### Boundary of this identity rule

The `binary name + defining ClassLoader` model above is the main rule for the **ordinary named classes/interfaces** taught in this module. Some special runtime types are not created through the same direct `ClassLoader#defineClass` path:

```text
array class
→ created automatically by the JVM when needed
→ for a reference component, getClassLoader() reflects the component type's loader
→ for a primitive component, getClassLoader() returns null via the bootstrap representation

primitive type / void
→ still have Class objects such as int.class / void.class
→ do not have an ordinary ClassLoader
```

No deeper array/primitive loading model is needed here; this note simply prevents the overgeneralization that every `Class<?>` is directly defined by a custom ClassLoader.
