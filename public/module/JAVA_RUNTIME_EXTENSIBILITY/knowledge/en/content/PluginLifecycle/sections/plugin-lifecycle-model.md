`ServiceLoader` does not define plugin lifecycle. If plugins own resources or need startup and shutdown behavior, the host must define a lifecycle model.

A simple model might be:

```text
DISCOVERED
→ VALIDATED
→ INITIALIZED
→ ACTIVE
→ STOPPING
→ STOPPED
```

Not every plugin needs every state. A stateless provider may only need discovery and use.

A state model becomes valuable when:

- initialization can fail;
- activation acquires resources;
- plugins serve concurrent requests;
- replacement needs traffic draining;
- cleanup must be guaranteed.

Lifecycle orchestration normally belongs to the host, while the plugin exposes the hooks and capabilities required by the contract.
