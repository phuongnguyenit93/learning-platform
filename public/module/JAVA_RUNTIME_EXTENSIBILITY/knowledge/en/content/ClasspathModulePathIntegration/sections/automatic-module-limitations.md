An automatic module is a JAR without an explicit `module-info.class` that is placed on the module path and treated as a named module by JPMS.

For service providers it has an important limitation:

```text
provider()
→ not supported as the provider construction mechanism

provider constructor
→ required
```

The provider class must therefore satisfy the service relationship and expose a public no-argument constructor.

This matters during migration. A provider JAR that used `META-INF/services` on the class path may operate as an automatic module on the module path, but it does not gain the full expressiveness of an explicit module descriptor.

If the architecture needs explicit `provides`, strong implementation encapsulation, or the static `provider()` factory mechanism, migrate the provider to an explicit named module.
