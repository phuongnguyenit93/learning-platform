Going native is justified when the capability you need is naturally owned by a native interface and the value outweighs the added deployment and safety cost.

Common cases include:

- calling an established native library instead of rewriting it in Java;
- integrating with an operating-system or hardware API that has no suitable Java wrapper;
- exchanging data with another runtime through native memory;
- embedding Java in a native host application through the JNI Invocation API;
- exposing a Java callback to a native library;
- working with file mappings or other native-memory-oriented data flows through FFM.

A useful decision question is: **what specific boundary forces this integration to exist?** If the answer is merely “native might be faster,” the design is incomplete. The actual cost can include copying, transition overhead, deployment complexity, platform variants, and harder failure analysis.

Start from the external contract. Identify the library, ABI, data representation, ownership model, and error model first. Only then choose JNI, FFM, or an existing maintained wrapper.
