Dependency conflict occurs when the host or different plugins require incompatible versions of one library.

For example:

```text
host → library X 1.x
plugin A → library X 1.x
plugin B → library X 2.x
```

With one shared class loader, only one definition is ultimately resolved according to loading rules. A plugin can then fail with `NoSuchMethodError`, `NoClassDefFoundError`, or subtler behavioral incompatibility.

Possible strategies include:

- align versions across the system;
- shade or relocate a private dependency;
- isolate plugins with separate loaders;
- keep the shared contract module minimal;
- avoid passing private-library types across the plugin boundary.

Isolation does not solve every conflict automatically. Types exchanged across the boundary still need compatible identity.

Dependency conflicts are a reason to design shared/private dependency policy early rather than introducing custom loaders only after production failures.
