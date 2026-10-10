A wildcard is a **type argument at a use site**, not a way to declare a new named type parameter.

These are valid:

```java
List<?> values;
List<? extends Number> numbers;
List<? super Integer> targets;
```

But a generic class cannot be declared with a wildcard:

```java
// class Box<?> { } // compile error
```

Nor can a wildcard be used directly as the type argument of the object being created:

```java
// new ArrayList<?>(); // compile error
```

Likewise, a wildcard cannot be the direct type argument in an `extends` / `implements` declaration:

```java
// class MyList extends ArrayList<?> { } // compile error
```

Mental model:

```text
<T>
→ declares a named type variable

?
→ describes an unknown type argument at a use site
```
