`ElementType.TYPE_USE` allows metadata to describe a **use of a type**, not only the surrounding declaration.

```java
List<@NonNull String> names;
```

Here `@NonNull` describes the `String` used as the list's element type.

Other examples include casts and implemented/extended types:

```java
String value = (@NonNull String) input;

class CachedRepository implements @ReadOnly Repository {
}
```

Type-use annotations are especially useful to static-analysis tools and pluggable type systems because they can express metadata at nested type positions that declaration-only annotations cannot distinguish.

### DISTINCTION — declaration vs the type inside a declaration

Consider a field:

```java
@Important String name;
```

Depending on `@Important`'s targets, the annotation may describe the field declaration, the use of type `String`, or be applicable in both ways. Tool authors should inspect the precise target/location model instead of inferring semantics only from visual placement.

`TYPE_PARAMETER` is also distinct from `TYPE_USE`:

```java
class Box<@TypeParameterMarker T> {
}
```

Use the target that matches the semantic question the consumer actually asks.

One Java-language convenience is easy to miss: an annotation interface targeted with `TYPE_USE` is also applicable in type-declaration and type-parameter declaration contexts. That does not erase the conceptual distinction; tooling still needs to understand which declaration/type location it is inspecting.

### EDGE CASE — local declarations and type annotations use different metadata channels

> **Beginner boundary:** do not memorize class-file representation details here. The important point is that a declaration annotation and a type annotation near the same local variable are different metadata channels.

Declaration annotations on local-variable declarations and lambda formal-parameter declarations are not retained in the binary through the ordinary declaration-annotation channel, even when the annotation type declares `CLASS` or `RUNTIME` retention.

A type annotation on the type used in the corresponding context is a separate metadata channel with its own class-file/runtime representation rules.

So `RUNTIME` retention does not mean every `@...` occurrence in source automatically becomes runtime declaration metadata. Read retention together with the annotation's target and actual use site.
