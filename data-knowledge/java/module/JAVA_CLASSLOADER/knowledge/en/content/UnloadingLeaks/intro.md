# Unloading, Retention, and Loader Leaks

Custom loaders make runtime namespaces disposable in principle. A plugin can be loaded, used, stopped, and replaced by a new loader with new class definitions. The hard part is reachability: the JVM cannot reclaim classes while their defining loader is still reachable from live application state.

This is why ClassLoader leaks are especially expensive. Retaining one old loader can indirectly retain the metadata, static state, resources, and objects associated with many classes from an old plugin or application deployment.
