A plugin system needs a deliberate dependency policy.

A common safe shape is:

```text
host
  ↓
contract/api module
  ↑
plugin A     plugin B
```

Keep the contract module small and stable, containing only types that truly need to be shared.

Plugin-specific libraries should stay private when the host does not need them. Sharing too many libraries increases version conflicts and class-identity coupling.

Avoid cycles such as:

```text
host → plugin
plugin → host implementation
```

If a plugin needs a host capability, expose it through a stable host-facing contract or context rather than importing implementation packages.

For example:

```java
interface PluginContext {
    Logger logger();
    Path dataDirectory();
}
```

This dependency policy becomes the foundation for isolation and compatibility later in the module.
