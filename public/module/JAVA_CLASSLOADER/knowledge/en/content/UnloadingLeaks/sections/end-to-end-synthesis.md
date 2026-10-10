That is the final mental model for this module:

```text
lifecycle spine
class bytes
  → loading request follows parent/delegation and custom-loader lookup rules
  → one loader ultimately defines the ordinary named class
  → binary name + defining ClassLoader establish runtime type identity
  → linking prepares the type
  → initialization runs on active use
  → objects/classes live while reachable
  → custom-loader classes become unloadable only when the defining-loader graph is no longer rooted

cross-cutting lookup/discovery
TCCL
  → may provide a different discovery context for child/application providers

Class / ClassLoader resource APIs
  → locate resources in a loader-visible namespace
  → resource lookup does not itself define a class
```

ClassLoader behavior is therefore not only about finding files. It defines namespaces, type compatibility, discovery boundaries, initialization lifecycles, and the unit of disposal for dynamic Java systems.
