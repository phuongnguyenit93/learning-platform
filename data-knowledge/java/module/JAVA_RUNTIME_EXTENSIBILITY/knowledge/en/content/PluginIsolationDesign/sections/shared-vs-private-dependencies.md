Dependencies usually fall into two groups:

```text
shared
→ contract/API and libraries that truly require interoperability

private
→ implementation libraries needed only by one plugin
```

Sharing too much destroys isolation. Sharing too little can duplicate type identities for objects that cross the boundary.

For example, avoid making a contract DTO depend on a library that each plugin loads privately if the JVM must exchange that concrete type across loaders.

A practical policy might be:

- JDK types and contract API: shared;
- logging façade/context supplied by the host: shared when required by the contract;
- rendering/parser/native client libraries: private;
- transitive implementation dependencies: private by default.

The smaller the shared boundary, the easier compatibility becomes to reason about.
