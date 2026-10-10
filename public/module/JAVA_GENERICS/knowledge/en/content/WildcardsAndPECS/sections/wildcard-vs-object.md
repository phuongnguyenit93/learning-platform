This is a common source of confusion:

```java
List<?> unknown;
List<Object> objects;
```

`List<Object>` means the **exact element type is Object**. It can therefore accept strings, integers, users, and other objects:

```java
objects.add("java");
objects.add(123);
```

`List<?>` means an **exact element type exists, but this code does not know which one**. The variable may refer to `List<String>`, `List<Integer>`, `List<User>`, and so on:

```java
List<String> names = new ArrayList<>();
List<?> unknown = names; // OK
```

Because the compiler does not know the captured element type, arbitrary concrete values cannot be added:

```java
// unknown.add("java"); // compile error
```

Mental model:

```text
List<Object>
→ exact element type is Object

List<?>
→ this is a List of ONE specific type
→ that type is unknown here
```
