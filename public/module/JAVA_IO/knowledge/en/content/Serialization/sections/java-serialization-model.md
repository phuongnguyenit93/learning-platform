A class participating in native serialization commonly implements the marker interface `Serializable`:

~~~java
final class Note implements Serializable {
    private static final long serialVersionUID = 1L;

    private final String title;
    private final String body;

    Note(String title, String body) {
        this.title = title;
        this.body = body;
    }
}
~~~

`Serializable` declares no methods. It is a **marker interface**: implementing it tells the serialization mechanism that instances of the class may participate.

Writing an object:

~~~java
Path file = Files.createTempFile("note-", ".ser");

try (
        OutputStream out = Files.newOutputStream(file);
        ObjectOutputStream objectOut = new ObjectOutputStream(out)
) {
    objectOut.writeObject(
            new Note("I/O", "Java serialization demo")
    );
}
~~~

Reading it back:

~~~java
try (
        InputStream in = Files.newInputStream(file);
        ObjectInputStream objectIn = new ObjectInputStream(in)
) {
    Note note = (Note) objectIn.readObject();
}
~~~

The mental model is not:

~~~text
object
→ JSON-like field map
~~~

It is closer to:

~~~text
Java object graph
→ ObjectOutputStream writes Java serialization protocol
→ byte stream contains class/type descriptors + state + graph references
→ ObjectInputStream reads the protocol
→ JVM reconstructs Java objects
~~~

The resulting bytes should not be treated as a human-readable, language-independent, or automatically long-term-stable contract.
