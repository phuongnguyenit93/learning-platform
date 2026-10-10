Deactivation answers when a plugin stops accepting work and who releases each resource.

A common flow is:

```text
mark unavailable
→ stop new requests
→ wait for or cancel in-flight work
→ invoke stop/close
→ release references and resources
```

`AutoCloseable` can be a suitable contract for a simple lifecycle:

```java
public interface ManagedExporter extends ReportExporter, AutoCloseable {
    @Override
    void close();
}
```

More complex plugins may need multiple phases instead of one `close()` method.

Resource ownership must be explicit. If the host supplies an executor, the host typically owns it. If the plugin creates a scheduler, the plugin should stop it. Ambiguous ownership is a common source of leaks.

Cleanup also needs to work after partial initialization, so lifecycle code should be able to roll back partially acquired resources.
