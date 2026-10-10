An extension point is an intentional location where the host allows externally supplied behavior to participate.

`ReportExporter` is an extension point if the host allows new export formats to be added without changing host code.

A useful extension point defines:

- the capability being extended;
- when the host invokes the extension;
- input/output contracts;
- error semantics;
- concurrency and lifecycle expectations;
- resource ownership;
- compatibility expectations.

Not every interface should become an extension point. An internal interface used for code organization is different from a public plugin boundary.

If the contract is too broad, providers learn too much about host internals. If it is too narrow, the host starts using casts, reflection, or side channels to reach the real capability.

Extension-point design balances **boundary stability** with enough expressiveness for real providers.
