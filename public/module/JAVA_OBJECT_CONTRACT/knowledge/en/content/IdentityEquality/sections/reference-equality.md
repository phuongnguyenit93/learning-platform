For references, `==` only checks whether both references identify the same object, or whether both are `null`.

```java
String a = new String("java");
String b = new String("java");
String same = a;

System.out.println(a == b);       // false
System.out.println(a == same);    // true
System.out.println(a.equals(b));  // true
```

### WHAT DOES DEFAULT `Object.equals()` DO?

If a class does **not** override `equals`, it inherits `Object.equals()`, whose equality semantics are identity-based.

```java
final class UserId {
    private final String value;

    UserId(String value) {
        this.value = value;
    }
}

UserId a = new UserId("U-100");
UserId b = new UserId("U-100");

System.out.println(a == b);       // false
System.out.println(a.equals(b));  // false: default Object.equals
```

That is why domain classes override `equals` when they need logical equality: **Java cannot infer which fields define “the same value” for your type**.

### WHEN IS `==` THE RIGHT TOOL?

Identity comparison is appropriate when identity itself matters, for example:

- enum constants;
- singleton instances;
- sentinel objects;
- checking whether two references deliberately share one object.

It is usually the wrong operation for value-like objects such as `String`, money values, or identifier value objects.

> String literals and compile-time constant string expressions are interned according to Java's string-literal semantics, so equal literals can deliberately refer to the same pooled instance. Runtime-created strings do not gain that guarantee automatically. This still does not make `==` a correct content-comparison operator for `String`.
