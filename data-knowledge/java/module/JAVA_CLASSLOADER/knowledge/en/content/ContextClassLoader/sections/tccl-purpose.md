Imagine a reusable framework class loaded by a parent loader:

```text
parent/shared loader
  └─ framework discovery code

child/application loader
  ├─ application classes
  └─ service provider implementation
```

Normal delegation points upward: the child can ask the parent. The parent cannot automatically search every child that might exist beneath it, and there may be many unrelated children.

The TCCL solves this by associating a loader with the **current thread**:

```java
ClassLoader contextLoader = Thread.currentThread().getContextClassLoader();
```

Framework/library code can use that loader as a caller-provided discovery context. The thread therefore carries information about "which application/provider namespace should this work use?"

That is why TCCL belongs in the ClassLoader module: it is a controlled way to cross a loader visibility direction that parent delegation alone does not solve.

It does **not** change who defines already-loaded classes. If the context loader finds and defines `demo.plugins.HelloPlugin`, that loader still participates in the class identity exactly as before.

### Why can the framework's own loader fail while TCCL succeeds?

Suppose framework code is parent-defined while the provider is visible only to a child loader:

```text
framework defining loader
→ sees parent/shared namespace
→ cannot see HelloPlugin in the child

thread context ClassLoader = PluginClassLoader
→ can see HelloPlugin and provider metadata
→ discovery can succeed
```

That is the core reason TCCL exists: code can use a **lookup context different from the framework class's own defining loader** when the architecture needs child/application visibility.
