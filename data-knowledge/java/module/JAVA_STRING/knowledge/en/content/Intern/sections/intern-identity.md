```java
String a = new String("java");
String b = a.intern();
String c = "java";

System.out.println(b == c); // true
```

`b` uses the canonical pooled reference for `"java"`.

Application logic should still use `equals` when the question is content equality.

Interning connects directly to literals:

```java
String runtime = new String("java");
String canonical = runtime.intern();
String literal = "java";

System.out.println(canonical == literal); // true
```

This is an appropriate identity experiment because canonicalization itself is the concept being observed.
