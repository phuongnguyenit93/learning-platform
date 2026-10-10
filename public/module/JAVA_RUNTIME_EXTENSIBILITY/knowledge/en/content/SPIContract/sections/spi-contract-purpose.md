An SPI (Service Provider Interface) is the contract a host publishes so independently developed providers can supply a capability to the system.

The important property is the dependency direction:

```text
host ────────┐
             ↓
        service contract
             ↑
provider ────┘
```

The host and providers depend on the contract; the host does not depend directly on provider implementations.

Without a stable contract, a “plugin” may merely be a dynamically loaded class that still exposes implementation details. The contract gives both sides a shared vocabulary that can evolve independently within known compatibility rules.

A useful SPI should establish:

- what capability a provider supplies;
- stable inputs and outputs;
- error semantics the host must handle;
- whether providers are stateful or have lifecycle requirements;
- expectations around thread safety, resources, and compatibility.

An SPI is therefore an **architecture boundary**, not just an interface for `ServiceLoader` to locate.
