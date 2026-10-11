A marker annotation declares no elements:

```java
public @interface InternalOnly {
}
```

Its presence is the entire signal:

```java
@InternalOnly
class DebugEndpoint {
}
```

Markers work well for binary questions such as “does this declaration belong to this category?”. They are less suitable when the metadata naturally needs attributes that callers will soon encode indirectly in names or companion constants.

Do not confuse a **marker annotation type** with marker-style syntax. An annotation type whose elements all have defaults can be written simply as `@Feature`, but it is not a true marker annotation because its schema still contains elements.

```text
presence alone has complete meaning
→ marker annotation can be clear

consumer needs mode, category, owner, priority...
→ explicit elements usually communicate the contract better
```
