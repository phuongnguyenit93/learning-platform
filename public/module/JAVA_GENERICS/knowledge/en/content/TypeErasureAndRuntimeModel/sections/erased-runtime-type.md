```java
List<String> texts = new ArrayList<>();
List<Integer> numbers = new ArrayList<>();

System.out.println(texts.getClass() == numbers.getClass()); // true
```

Both objects are instances of the same runtime `ArrayList` class. The JVM does not create separate `ArrayList<String>` and `ArrayList<Integer>` runtime classes.

So runtime cannot take an arbitrary reference and ask whether the object is truly a `List<String>`:

```java
Object value = new ArrayList<String>();
// if (value instanceof List<String>) { } // compile error
```

On a first pass, keep two ideas separate:

- erasure means runtime objects do not carry concrete type arguments in a form that supports arbitrary element-type tests;
- class files can retain **generic signature metadata** for declarations; the Reflection module later shows how to inspect that metadata.
