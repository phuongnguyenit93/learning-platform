For the plugin system, keep the distinction clear:

```text
ClassLoader.loadClass("demo.plugins.HelloPlugin")
  → defines or returns a runtime type

ClassLoader.getResource("demo/plugins/plugin.properties")
  → locates non-class data
```

Both use a loader namespace, but only the first creates/returns class identity. The next chapter returns to class lifecycle and examines what happens when initialization finally runs.
