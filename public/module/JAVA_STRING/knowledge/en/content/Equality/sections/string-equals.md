`String.equals` compares String content:

```java
String a = new String("java");
String b = new String("java");

System.out.println(a.equals(b)); // true
```

When the question is “do these text values contain the same sequence?”, `equals` is the normal operation.

### equals is case-sensitive

```java
"Java".equals("java"); // false
```

`equals` checks String value equality; it does not perform Unicode normalization, locale-sensitive collation, or full linguistic equivalence.

### Null-safe comparison

Calling a method on `null` fails:

```java
String actual = null;
// actual.equals("java"); // NullPointerException
```

If the expected value is known to be non-null:

```java
"java".equals(actual); // false
```

If both values may be null:

```java
Objects.equals(left, right);
```

`Objects.equals` handles null first and delegates to `equals` for non-null values.

### Ordering is not equality

`compareTo` answers a lexicographic-order question over the String's `char`/UTF-16 code-unit sequence:

```java
"abc".compareTo("abc"); // 0
"abc".compareTo("abd"); // < 0
"abd".compareTo("abc"); // > 0
```

Do not assume the result is always `-1`, `0`, or `1`; the sign is the relevant contract.

This is String's natural ordering, not human-language collation. It is useful for many technical values; locale/language-sensitive ordering may require `Collator` from the localization boundary.
