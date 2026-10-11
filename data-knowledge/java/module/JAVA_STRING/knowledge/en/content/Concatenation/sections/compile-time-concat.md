When the whole concatenation is a Java **constant expression**, it is evaluated at compile time:

```java
String value = "ja" + "va";
```

The result is a constant String and is interned, so this example has the same canonical reference as the literal `"java"`. Do not generalize that identity guarantee to concatenation whose values are determined at runtime.

Constant variables can participate too:

```java
final String left = "ja";
String a = left + "va";
String b = "java";

System.out.println(a == b); // true
```

### final does not automatically mean compile-time constant

A `final` variable participates in a constant expression only when it is actually a Java **constant variable**:

```java
final String prefix = "ja";
String a = prefix + "va";
String b = "java";

System.out.println(a == b); // true
```

But a value determined at runtime is different:

```java
final String prefix = args.length > 0 ? args[0] : "ja";
String a = prefix + "va";
String b = "java";

System.out.println(a.equals(b));
```

`final` prevents reassignment; it does not convert every runtime expression into a compile-time constant. The important concept is **compile-time constant expression**, not merely the presence of `final`.
