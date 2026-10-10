`split` turns one String into multiple parts, while `String.join` combines parts using a delimiter:

```java
String csv = "red,green,blue";
String[] colors = csv.split(",");

String path = String.join("/", "api", "users", "42");
// "api/users/42"
```

An important rule is that `String.split(...)` accepts a **regular expression**, not always a literal delimiter.

```java
"a.b.c".split("\\.");
```

This example has both Java String-literal escaping and regex escaping. The Regex chapter explains those two layers in depth.

When a delimiter is intended to be literal but has regex meaning, quote it deliberately or choose an API whose contract matches the task instead of guessing the escaping rules.

### split(regex, limit) changes result preservation

`split(regex)` has the same behavior as `split(regex, 0)`: the regex is applied repeatedly and trailing empty strings are discarded:

```java
System.out.println("a,b,".split(",").length);    // 2
System.out.println("a,b,".split(",", 0).length); // 2
```

When `limit < 0`, matching is not positively bounded and trailing empty strings are preserved:

```java
System.out.println("a,b,".split(",", -1).length); // 3
```

When `limit > 0`, the result contains at most `limit` elements, so the regex is applied at most `limit - 1` times. The final element keeps the remaining input:

```java
Arrays.toString("a,b,c,d".split(",", 2));
// [a, b,c,d]

Arrays.toString("a,b,c,d".split(",", 3));
// [a, b, c,d]
```

Mental model:

```text
limit > 0
→ at most limit elements
→ final element keeps the remainder

limit == 0
→ no positive split bound
→ discard trailing empty strings

limit < 0
→ no positive split bound
→ preserve trailing empty strings
```

`limit` is a data-parsing contract, not merely a performance option. If trailing empty fields or the unsplit remainder have semantic meaning, choose the overload deliberately.

This also shows why real CSV may require a parser: quoting and escaping rules are more complex than a simple delimiter.
