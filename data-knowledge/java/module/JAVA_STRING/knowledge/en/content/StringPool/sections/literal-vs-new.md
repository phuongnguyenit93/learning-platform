```java
String a = "java";
String b = new String("java");
```

`a` refers to the pooled literal, while `new String(...)` requests a distinct object.

Therefore `a == b` is false while `a.equals(b)` is true.

Avoid `new String("...")` when a literal already expresses the intended value.

`new` does not make a String mutable:

```java
String x = new String("java");
x.toUpperCase();

System.out.println(x); // java
```

The constructor changes object creation, not the immutability contract.
