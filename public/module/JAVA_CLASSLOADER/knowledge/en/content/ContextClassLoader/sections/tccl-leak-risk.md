The TCCL is a strong reference from a `Thread` to a `ClassLoader`. If the thread outlives a plugin or application deployment, that one reference can keep the loader reachable and prevent its classes from becoming unloadable.

The dangerous shape is:

```text
long-lived thread / executor worker
        ↓ contextClassLoader
old PluginClassLoader
        ↓
plugin classes and associated loader state
```

This is especially relevant for:

- shared thread pools that survive application redeploy;
- plugin-created background threads that are never stopped;
- host threads whose TCCL was changed and never restored;
- thread factories that intentionally install a plugin loader but are not shut down with the plugin.

The immediate prevention rule is to restore temporary TCCL changes and stop plugin-owned threads/executors as part of plugin shutdown.

The leak mechanism should be stated precisely: the TCCL is harmful here because a **longer-lived root** retains the loader. Merely having references among plugin classes and their own static fields does not automatically prevent collection if the entire loader graph becomes unreachable from outside.

The final chapter returns to that reachability model in detail. Before that, the next chapter separates class loading from another operation that often uses the same loader hierarchy: loading non-class resources.
