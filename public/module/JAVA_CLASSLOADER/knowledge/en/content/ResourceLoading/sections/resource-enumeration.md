Sometimes the correct operation is not "give me the first matching resource" but "show me every provider/configuration fragment with this name."

`ClassLoader.getResources` returns an `Enumeration<URL>`:

```java
ClassLoader loader = Thread.currentThread().getContextClassLoader();
Enumeration<URL> resources = loader.getResources("META-INF/services/demo.api.Plugin");

while (resources.hasMoreElements()) {
    System.out.println(resources.nextElement());
}
```

Java also exposes a stream form:

```java
try (Stream<URL> resources = loader.resources("META-INF/services/demo.api.Plugin")) {
    resources.forEach(System.out::println);
}
```

Enumeration is valuable in plugin/framework scenarios because several JARs can contribute resources with the same logical name. `ServiceLoader`, for example, is built around the idea that provider metadata may come from multiple locations visible to a loader.

With the default ClassLoader implementation, parent resources participate in the search before resources found by the current loader. Custom loaders can define different lookup behavior, so application semantics should not depend on an undocumented global ordering between unrelated deployment artifacts.

When duplicates matter, design an explicit merge rule rather than silently accepting whichever resource happens to appear first.
