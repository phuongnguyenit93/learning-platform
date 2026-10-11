Three concepts are easy to confuse:

```text
rediscovery
→ search the runtime environment again

ServiceLoader.reload()
→ clear one ServiceLoader's cache and rediscover

plugin reload
→ deactivate old plugin + release resources + load/activate replacement
```

`ServiceLoader.reload()` only covers a small part of the middle step. It does not stop old provider instances and does not unload their classes.

If the plugin set changes through another JAR or class loader, the host may need a new discovery context. Modular plugins commonly require a new `Configuration`/`ModuleLayer`.

Hot reload is a separate architecture capability with races to handle:

- requests still using the old plugin;
- replacement activation failures;
- slow cleanup;
- stale references retaining the old plugin.

Without a real hot-reload requirement, process restart is often simpler and safer.
