A ClassLoader is infrastructure shared by potentially many class-loading requests, so correctness includes more than returning the right bytes.

The base `loadClass` implementation coordinates loading through a class-loading lock. This prevents racing requests from defining the same name twice. Loaders that replace `loadClass` must preserve equivalent synchronization.

> **Advanced — safe to skip on the first pass:** loaders can become **parallel-capable**, but that requires deliberately following the `ClassLoader.registerAsParallelCapable()` contract through the loader hierarchy. It is not a default requirement for a basic custom loader.

Package boundaries also follow loader identity. At runtime, package membership used for access control is effectively tied to both the package name and the defining loader. Two classes named:

```text
demo.internal.First   — defined by loader A
demo.internal.Second  — defined by loader B
```

do not gain package-private access to each other merely because both names begin with `demo.internal`. They belong to different runtime package identities.

That can surprise plugin systems that split cooperating implementation classes across different loaders. If two classes need package-private cooperation, they should normally be defined within the same intended loader/package boundary.

Other practical rules follow from the same ownership model:

- keep shared API types in a parent visible to all participating plugins;
- isolate implementation dependencies only when there is a concrete reason;
- do not let arbitrary child-first rules shadow host contracts accidentally;
- preserve package/signing constraints when loading signed artifacts;
- release the custom loader and everything externally retaining it when the plugin lifecycle ends.

The last point becomes critical later: a custom loader creates a namespace, and retaining that loader can retain the entire namespace. Before discussing leaks, the next chapter first makes the identity consequences precise.
