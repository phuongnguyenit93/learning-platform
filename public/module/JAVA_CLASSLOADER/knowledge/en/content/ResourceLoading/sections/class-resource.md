`Class.getResource(String)` uses the class as the lookup context.

For a class in package `demo.plugins`:

```java
package demo.plugins;

final class HelloPlugin {
    void inspectResources() {
        System.out.println(HelloPlugin.class.getResource("plugin.properties"));
        System.out.println(HelloPlugin.class.getResource("/shared/banner.txt"));
    }
}
```

the two names mean different things:

```text
"plugin.properties"
  → relative to the class package
  → demo/plugins/plugin.properties

"/shared/banner.txt"
  → absolute from the class/module resource root
  → shared/banner.txt
```

That package-relative behavior is useful when a class owns a nearby template or metadata file. Moving the package moves the conceptual resource namespace with the class.

> **Advanced — JPMS boundary:** the lookup still depends on the class's runtime loading/module context. In named modules, resource encapsulation rules can restrict access to non-class resources. A path that would have worked on a flat class path should not be assumed to bypass JPMS module boundaries merely because it is requested through `Class.getResource`.

The result is a `URL` or `null`:

```java
URL resource = HelloPlugin.class.getResource("plugin.properties");

if (resource == null) {
    throw new IllegalStateException("plugin.properties is missing");
}
```

Treat `null` as a normal "not found / not accessible through this lookup" result rather than assuming every build layout places the requested file in the runtime resource path.
