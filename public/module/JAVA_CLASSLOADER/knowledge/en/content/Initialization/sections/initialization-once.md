The JVM initializes a particular class identity at most once successfully. Repeated active uses do not rerun its static initialization.

```java
final class PluginMetrics {
    static {
        System.out.println("initializing PluginMetrics");
    }

    static void record() {}
}

PluginMetrics.record();
PluginMetrics.record();
```

The initialization message appears once for that runtime class.

The Class Identity chapter explains why the phrase **that runtime class** matters. If two different ClassLoaders each define `demo.plugins.PluginMetrics`, the JVM has two different `Class<?>` identities:

```text
(demo.plugins.PluginMetrics, loader A)
(demo.plugins.PluginMetrics, loader B)
```

Each identity has its own static fields and its own initialization lifecycle. Therefore the same class bytes can execute static initialization once under loader A and once again under loader B.

This is a common source of surprises in plugin systems and containers. A "singleton" implemented with a static field is singleton-like only inside one particular class identity, not automatically across every ClassLoader in the JVM.

The prerequisite-ordering rules described earlier still apply to each of these runtime identities. The important point here is ownership of state: each distinct runtime class identity has its own initialization state and reaches the initialized state independently.
