Choose a mechanism from requirements, not from how “advanced” it sounds.

| Need | Usually sufficient mechanism |
|---|---|
| Implementation known at build time | Static wiring / DI |
| Provider JARs discovered at startup | Class-path `ServiceLoader` |
| Named-module service providers | `uses` / `provides` + `ServiceLoader` |
| Separate runtime module graph | `Configuration` + `ModuleLayer` |
| Stronger dependency isolation in one JVM | Dedicated loaders/layers |
| Strong failure isolation | A process boundary may be more appropriate |

Do not introduce `ModuleLayer` when a fixed startup module path is enough.

Do not build a custom plugin framework when `ServiceLoader` plus a small validated registry satisfies the requirement.

Conversely, do not call `ServiceLoader.reload()` a hot-reload architecture when plugins have real state, resources, and class-loader lifecycle.

Complexity is worth paying for only when it solves a concrete requirement.
