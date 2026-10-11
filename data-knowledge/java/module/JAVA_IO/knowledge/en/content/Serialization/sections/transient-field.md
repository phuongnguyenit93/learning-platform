Not every instance field should become part of the serialized form. The `transient` keyword excludes a field from default serialization:

~~~java
final class SessionSnapshot implements Serializable {
    private static final long serialVersionUID = 1L;

    String username;
    transient String temporaryToken;
}
~~~

After default deserialization, `temporaryToken` has the default value for its type, which is `null` here.

`transient` is useful for data that:

- can be recomputed from other state;
- only makes sense in the current runtime;
- refers to an object that should not/cannot be serialized;
- should not be part of the serialized form.

`static` fields are class state rather than per-instance state, so they are also not part of the default serialized object state.

Do not treat `transient` as a complete security feature. It only controls participation in default serialized form. If sensitive data is copied elsewhere, explicitly written by custom serialization, or exposed through another artifact, the keyword does not solve that design problem.

Java also supports custom `writeObject/readObject` and related hooks. They provide more control but enlarge the compatibility and security surface. Add them only when there is a deliberate serialized-form contract that requires them.
