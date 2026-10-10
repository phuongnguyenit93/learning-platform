An SPI is a boundary across independently compiled artifacts, so contract changes deserve more care than changes to an internal API.

Even a small-looking change, such as adding another abstract method, may make existing providers incompatible with the new host expectations.

Useful design rules include:

- keep the contract module small and dependency-light;
- avoid implementation-specific types;
- use default methods only when a real backward-compatible default exists;
- add capabilities in ways that allow older providers to remain useful when possible;
- document `null`, exception, concurrency, and resource-ownership behavior;
- never require the host to cast a provider to its concrete class.

For example, avoid this:

```java
if (exporter instanceof PdfExporter pdf) {
    pdf.enableInternalFeature();
}
```

If the capability belongs to the contract, model it in the SPI. Otherwise the host is breaking the abstraction boundary.

Version compatibility is covered in depth later. The key idea here is that the **SPI is the public compatibility surface between a host and its extensions**.

Once the contract is stable, the next question is no longer “what does a provider implement?” but **how the host finds providers at runtime**. The next chapter therefore moves from SPI design into `ServiceLoader` and discovery semantics.
