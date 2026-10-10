# Java Object Serialization Boundary

So far we have mostly moved bytes or text. Java also has a mechanism for turning the state of an **object graph** into a byte stream and reconstructing that graph later. An object graph is a root object plus the objects reachable through its fields/references; it can contain shared references and cycles. Turning that graph into bytes and reconstructing it later is commonly called **Java native serialization**.

The name can tempt a beginner to treat it as the default way to store objects in a database/cache or send them over a network. That is a poor default. Native serialization is tightly coupled to Java classes, version compatibility, the **classpath** — the set of classes/resources the JVM can find and load at runtime — and **deserialization**, meaning reading serialized bytes to reconstruct the object graph. It is therefore a boundary-heavy mechanism rather than a general persistence or network-format recommendation.
