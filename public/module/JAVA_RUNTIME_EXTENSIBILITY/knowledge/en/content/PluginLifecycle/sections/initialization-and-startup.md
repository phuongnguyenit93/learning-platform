Initialization is where a plugin receives context/configuration and allocates the resources it needs.

For example:

```java
public interface Plugin {
    void initialize(PluginContext context) throws PluginException;
    void start() throws PluginException;
}
```

Separating `initialize` and `start` can let the host construct and validate all plugins before publishing any of them.

The contract must say whether initialization is one-shot or idempotent. Do not assume repeated initialization is safe.

If a provider constructor performs heavy work such as network calls, thread creation, or large file access, discovery may accidentally trigger those side effects. Complex plugins are often easier to control when constructors stay light and lifecycle hooks perform resource work.

Startup failures should retain the plugin identity and original cause so diagnosis remains straightforward.
