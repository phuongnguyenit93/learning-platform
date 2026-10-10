`ClassLoader.getResource(String)` uses a loader-root name. The conventional form does **not** begin with `/`:

```java
ClassLoader loader = HelloPlugin.class.getClassLoader();

URL config = loader.getResource("demo/plugins/plugin.properties");
URL banner = loader.getResource("shared/banner.txt");
```

Compare the equivalent intent:

```java
HelloPlugin.class.getResource("plugin.properties");
loader.getResource("demo/plugins/plugin.properties");
```

Both may find the same physical resource, but they express the path from different starting points.

A common bug is carrying the leading `/` rule from `Class.getResource` into `ClassLoader.getResource`:

```java
// Usually wrong for ClassLoader lookup:
loader.getResource("/shared/banner.txt");

// Root-style ClassLoader name:
loader.getResource("shared/banner.txt");
```

Default ClassLoader resource lookup also follows loader delegation behavior: parent-visible resources may be found before resources owned by the child. A custom ClassLoader can alter resource lookup just as it can alter class lookup, so plugin isolation should define both class and resource policy deliberately.

> **Advanced — JPMS boundary:** named modules add resource-encapsulation rules on top of these path rules. The ClassLoader API is therefore not a universal escape hatch around JPMS visibility.
