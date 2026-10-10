The common convenience call:

```java
ServiceLoader.load(ReportExporter.class)
```

uses the current thread's **context class loader** as the starting discovery context.

That matters in containers and plugin systems where host code may be defined by one loader while extensions are visible only from another context loader.

When the discovery context should be explicit, use:

```java
ClassLoader pluginLoader = ...;

ServiceLoader<ReportExporter> loader =
        ServiceLoader.load(ReportExporter.class, pluginLoader);
```

Class-loader-based discovery is more than “scan this directory.” Visibility, parent delegation, named modules associated with loaders/layers, and service-configuration resources in unnamed modules all influence what can be found.

One practical consequence is that a `ServiceLoader` created with the context-loader convenience method should not be cached VM-wide when multiple applications use different context class loaders. A provider appropriate for one application may be invisible or inappropriate for another.

When plugin isolation uses dedicated class loaders, make loader context an explicit part of the plugin boundary rather than relying everywhere on ambient thread state.
