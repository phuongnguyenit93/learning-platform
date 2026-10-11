The clean plugin design keeps the contract in a loader visible to both sides:

```text
Application loader
  └─ demo.api.Plugin
       ↑ shared identity
       │
       ├─ PluginClassLoader A
       │    └─ HelloPlugin implements parent-owned Plugin
       │
       └─ PluginClassLoader B
            └─ MetricsPlugin implements parent-owned Plugin
```

Then each plugin implementation can be isolated while both still satisfy the host's `Plugin` interface:

```java
Object instance = pluginType.getDeclaredConstructor().newInstance();
Plugin plugin = (Plugin) instance; // works if Plugin was delegated to shared parent
```

Types that cross the boundary deserve the same care. Shared DTOs, exceptions, annotations, callback interfaces, and service contracts should come from a common loader or use a neutral transport representation that both sides understand.

Avoid making the host API depend on plugin-private concrete classes:

```java
// Fragile across isolated loader boundaries
PluginImplementationDetails details();
```

Prefer a stable shared contract:

```java
PluginDescriptor descriptor();
```

where `PluginDescriptor` is defined with the shared API.

Reflection can inspect an object across a loader boundary, but it does not erase the boundary. `Class`, method parameter types, annotations, and reflective invocation all still operate on real runtime type identities. This is where ClassLoader knowledge connects to the Reflection/Class-object topics without replacing them.

Once the shared boundary is correct, one discovery problem remains: framework code loaded by a parent may need to find providers that exist only in a child/application loader. The thread context ClassLoader is one standard bridge for that direction.
