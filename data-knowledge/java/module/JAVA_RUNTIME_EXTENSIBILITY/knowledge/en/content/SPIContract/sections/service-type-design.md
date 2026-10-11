The service type should describe **the capability the host needs**, not the provider's internal architecture.

To illustrate a contract with richer semantics than the baseline from the previous chapter, the following variant intentionally adds a capability check, domain type, and error contract:

```java
public interface ReportExporter {
    String format();
    boolean supports(Report report);
    void export(Report report) throws ExportException;
}
```

The host now has enough information to:

1. identify a provider's format or capability;
2. ask whether it supports the request;
3. invoke the operation;
4. handle errors at the contract boundary.

A service type should remain small, but not so small that the host must use reflection or implementation casts to discover provider capabilities. If selection requires important metadata, represent it through stable service methods or clearly defined metadata.

Avoid leaking host-internal types into the SPI:

```java
// Strong coupling: providers now depend on a host-internal class
void export(InternalReportEntity entity);
```

Prefer DTOs or value types in the contract module with intentionally stable semantics.
