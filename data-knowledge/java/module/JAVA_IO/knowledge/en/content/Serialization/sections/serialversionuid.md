Serialized bytes can outlive the exact class version that created them. Java therefore needs to decide whether the class available while reading is compatible with the class represented in the stream. `serialVersionUID` is part of that compatibility check:

~~~java
final class Note implements Serializable {
    private static final long serialVersionUID = 1L;

    String title;
    String body;
}
~~~

For an **ordinary serializable class**, if `serialVersionUID` is omitted, the runtime can compute a UID from class details. Class changes can then change the computed value in ways that make older data unreadable.

Classes that intentionally use native serialization therefore commonly declare the value explicitly:

~~~java
private static final long serialVersionUID = 1L;
~~~

Its limit is crucial: **keeping the same UID does not make every class change safe or semantically compatible**. It is only one piece of the serialization runtime's compatibility rules. Changes to fields, hierarchy, invariants, or custom serialization logic can still make old data inappropriate even when runtime accepts it.

Conversely, deliberately changing the UID can declare old serialized forms incompatible; reading them can result in `InvalidClassException`.

Record classes again have a special boundary: a serializable record has a default `serialVersionUID` of `0L` unless it declares one explicitly, and the requirement for matching stream/local `serialVersionUID` values is waived for records. That special rule is another reason to treat Java Object Serialization as a mechanism with type-specific contracts rather than one universal recipe.

Because serialized form is tied to class evolution, using native serialization for data expected to live for years often creates more migration and compatibility burden than a format designed around an explicit schema or contract.
