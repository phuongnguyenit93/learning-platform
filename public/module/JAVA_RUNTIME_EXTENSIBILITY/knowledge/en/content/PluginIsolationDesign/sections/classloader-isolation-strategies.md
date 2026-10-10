Several class-loader strategies are common at the architecture level:

```text
single loader
→ simplest, little isolation

parent-first plugin loader
→ shared/host classes win

child-first plugin loader
→ plugin-private versions win; package exclusions become important

one loader per plugin
→ stronger isolation and clearer lifecycle tracking
```

There is no universally correct choice.

Parent-first helps preserve shared contract identity but may force plugins to use host dependency versions. Child-first enables private versions but can accidentally duplicate contract types unless package rules are explicit.

`ModuleLayer` can map named modules using one loader, many loaders, or a custom mapping. More flexibility also creates more responsibility around readability and loading behavior.

Start from the isolation requirement rather than selecting a loader strategy because it is fashionable in plugin frameworks.
