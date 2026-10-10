The JVM specification ties class unloading to the lifetime of the **defining ClassLoader**. A class defined by a user-created loader can become unloadable only when that loader itself can be reclaimed by garbage collection.

Think of a plugin generation as a graph:

```text
PluginClassLoader
    ├─ Class<HelloPlugin>
    ├─ Class<PluginConfig>
    ├─ static state associated with those classes
    └─ loader/resource bookkeeping
```

When the plugin is stopped, dropping the manager's direct `PluginClassLoader` variable is necessary but not sufficient. **Every path from GC roots to that old loader graph must disappear.**

Conversely, cycles entirely inside the plugin graph are not automatically leaks. Modern tracing garbage collectors can reclaim unreachable cycles:

```text
old loader ↔ old classes ↔ old plugin objects

no path from a GC root
→ whole graph can be collectible
```

Classes defined by the bootstrap loading mechanism do not have a collectible user ClassLoader and therefore do not follow the disposable plugin-loader lifecycle.

This also explains why class unloading is much coarser than object collection. A class defined by a user-created ClassLoader cannot become unloadable while that defining loader itself remains non-reclaimable; those definitions do not have independent disposal lifecycles inside a still-live loader.

### Why ordinary application classes usually live for the process lifetime

In a typical Java application, the Application/System ClassLoader is long-lived—usually for roughly the lifetime of the JVM process. While that loader remains reachable, classes it defines do **not** have the disposable lifecycle of plugin classes.

```text
JVM process is alive
→ Application/System ClassLoader remains alive
→ application classes in that loader namespace usually remain loaded
→ dropping the last instance of one application class does not imply that class unloads
```

Class unloading becomes operationally important when the architecture deliberately creates a **disposable loader boundary**, such as:

```text
plugin loader
application-server deployment loader
hot-reload/devtools loader
isolated scripting/tooling loader
```

In those systems, the goal is to make an entire old loader generation unreachable so the namespace it owns can become reclaimable. That is why this chapter focuses on plugin/redeploy lifecycles rather than presenting unloading as the normal lifecycle of every application class.
