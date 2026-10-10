Deserializing native Java data is not the same as parsing a passive data structure. While reconstructing the graph, the serialization runtime can activate class-specific behavior such as custom `readObject`, `readResolve`, and validation hooks for classes present on the classpath.

Therefore, **do not deserialize native Java serialization from untrusted input**. Arbitrary client bytes, untrusted uploads, or messages crossing an external trust boundary should not be passed directly to `ObjectInputStream.readObject()`.

In deserialization attacks, a **gadget** is a class/method already available on the classpath whose special behavior can be abused while objects are being reconstructed. A **gadget chain** links several such gadgets so crafted serialized data can trigger a dangerous sequence of behavior. This is what the phrase “gadget/deserialization attack” refers to in discussions of native serialization risk.

~~~text
untrusted bytes
    ↓
ObjectInputStream.readObject()
    ↓
object graph reconstruction + class-specific hooks
    ↓
risk
~~~

`ObjectInputFilter` can constrain classes, graph depth, reference counts, or size in systems that must support serialization:

~~~java
ObjectInputFilter filter =
        ObjectInputFilter.Config.createFilter(
                "com.example.Note;java.base/*;!*"
        );

objectIn.setObjectInputFilter(filter);
~~~

The filter string above allows `com.example.Note`, allows classes from the `java.base` module, and then uses `!*` to reject other classes. Install the filter on the `ObjectInputStream` **before the first object read**, such as `readObject()` or `readUnshared()`, so the restriction applies from the moment graph reconstruction begins.

Filtering is **defense in depth**. It does not turn untrusted native deserialization into the recommended default.

Native serialization also carries non-security boundaries:

| Boundary | Consequence |
| --- | --- |
| Coupled to Java classes/classpath | Poor fit for cross-language contracts |
| Coupled to class evolution | Requires compatibility/version management |
| Binary protocol is opaque | Harder to inspect/debug than text/schema formats |
| Reconstructs an object graph | Larger runtime behavior surface than simple DTO parsing |
| History of gadget-chain/deserialization attacks | Untrusted input is a serious risk |

For network APIs, message contracts, or long-lived persistence, formats with an explicit contract such as JSON, Protocol Buffers, or another schema/format suited to the system are usually better defaults, combined with deliberate DTO/versioning design. The exact format depends on the problem, but **Java native serialization is not a general recommendation for persistence or interchange**.

When a legacy codebase already uses serialization, understanding the mechanism is still necessary to maintain it and narrow its boundary. The final chapter places serialization beside streams, readers/writers, `Files`, and channels so we can choose the simplest correct I/O abstraction for each problem.
