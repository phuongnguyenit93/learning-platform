Serialization does not stop at the first object. It traverses objects reachable through fields that are part of the serialized form.

For example:

~~~java
final class Author implements Serializable {
    private static final long serialVersionUID = 1L;
    String name;
}

final class Article implements Serializable {
    private static final long serialVersionUID = 1L;
    String title;
    Author author;
}
~~~

Serializing an `Article` also includes the `Author` referenced by its `author` field. If a reachable object is not serializable and that field is not excluded from serialization, runtime can throw `NotSerializableException`.

The object stream also preserves identity relationships in the graph. If two fields refer to the same object, the protocol can record a reference to an object already written instead of reconstructing two independent objects. Cycles can therefore be represented as well.

~~~text
Article A ─┐
           ├─→ the same Author instance
Article B ─┘
~~~

After deserialization, shared-reference relationships are restored according to the serialization protocol.

For an **ordinary serializable class**, deserialization does not invoke that class's ordinary constructor as if application code had called `new`. The nearest non-serializable superclass participates through its accessible no-argument constructor according to serialization rules. This is another sign that deserialization is more than “parse fields and call a constructor.”

Serializable **record classes are a defined exception to that ordinary-class rule**: during deserialization Java reconstructs the record component values and invokes the record's canonical constructor. Record serialization has additional special rules, so do not automatically apply every ordinary-`Serializable` constructor rule to records.

The ability to reconstruct a whole graph through this special lifecycle is one reason native serialization must be treated as a strong boundary.
