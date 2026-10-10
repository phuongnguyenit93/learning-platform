For simple literal text searches, direct String APIs are often clearer than regex:

```java
String path = "/api/users/42";

path.startsWith("/api/"); // true
path.endsWith("42");      // true
path.contains("users");   // true
path.indexOf("users");    // 5
path.lastIndexOf('/');     // 10
```

`indexOf(...)` and `lastIndexOf(...)` return `-1` when no match exists. If the returned position will later become a substring boundary, validate it first.

```java
int slash = path.lastIndexOf('/');
if (slash >= 0) {
    String id = path.substring(slash + 1);
}
```

Regex belongs here only when the real problem is **pattern matching**, not merely because some text must be searched.

`contains` does not interpret regex:

```java
System.out.println("file-123.txt".contains("\\d+")); // false
```

```text
literal search
→ contains / indexOf / startsWith / endsWith

pattern search
→ regex
```
