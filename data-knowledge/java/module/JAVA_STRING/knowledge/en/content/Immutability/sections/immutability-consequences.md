String immutability guarantees only that the String value itself cannot be mutated. Sharing the same String object is therefore usually safe with respect to its content, but that does not make a container holding Strings immutable or automatically thread-safe.

```java
List<String> names = new ArrayList<>();
names.add("Ada");
```

```text
String element value
→ immutable

List<String> structure
→ can still add/remove/reorder

List thread-safety
→ is a separate question; it does not follow from String immutability
```

Stable content is also why String works naturally as a `HashMap` key.

### Immutable is not the same as final

```java
String a = "java";
a = "kotlin"; // valid

final String b = "java";
// b = "kotlin"; // compile error
```

```text
immutable object
→ object state does not change

final variable
→ variable cannot be reassigned after initialization
```
