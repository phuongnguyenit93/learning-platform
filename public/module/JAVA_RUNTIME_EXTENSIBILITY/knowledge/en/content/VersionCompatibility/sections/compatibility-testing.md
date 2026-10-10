Compatibility should be tested as a **matrix** because failures often exist only in particular host/provider combinations.

For example:

```text
Host 2.0 × Plugin 1.8 → supported
Host 2.0 × Plugin 2.0 → supported
Host 2.0 × Plugin 3.0 → rejected
```

Tests should cover:

- discovery from real artifacts;
- contract method invocation;
- capability negotiation;
- lifecycle start/stop;
- old provider with a new host;
- new provider with the minimum supported host;
- dependency/class-loader isolation when used;
- clear rejection of incompatible providers.

One reusable contract-test suite can be applied to every provider implementation.

Include integration tests with actual JAR/module packaging because `META-INF/services`, module descriptors, and class-loader visibility problems do not appear when tests simply call `new Provider()`.
