# Thread Context ClassLoader (TCCL)

Parent delegation works naturally when a child asks a parent for shared types. Framework discovery sometimes needs the opposite direction: code owned by a parent or shared library needs to discover application/provider classes that only a child loader can see.

Read the discovery vocabulary in the simplest possible way:

```text
SPI (Service Provider Interface)
→ an interface/contract published for others to implement

provider
→ an implementation of that SPI

ServiceLoader
→ a JDK API that discovers declared providers
```

In the running example, `Plugin` is the SPI and `HelloPlugin` is a provider.

The **Thread Context ClassLoader (TCCL)** gives code a thread-associated loader to consult for that situation. It is a discovery bridge, not a replacement for the defining-loader identity rules learned earlier.
