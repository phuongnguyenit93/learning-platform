A `ModuleLayer` is created from an already-resolved `Configuration`. It is not a mutable registry where modules are freely added and removed afterward.

When the plugin set changes, a clearer model is:

```text
old artifacts
→ old Configuration
→ old Layer

new artifacts
→ new Configuration
→ new Layer
```

The host can then:

1. discover and validate the new layer;
2. activate new providers;
3. atomically switch registry/context;
4. drain and clean up the old generation;
5. release references to old layers/loaders when collection is desired.

`ModuleLayer.Controller` can adjust some reads/exports/opens relationships, but that does not turn a layer into a general module add/remove container.

If old threads, resources, or references retain plugin class loaders, old plugin classes will remain reachable even after the host switches layers.
