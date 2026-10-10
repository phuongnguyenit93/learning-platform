These array creations are illegal:

```java
// T[] values = new T[10];
// List<String>[] lists = new List<String>[10];
```

Arrays are reified and covariant: runtime knows the component type and performs store checks. A parameterized type such as `List<String>` is non-reifiable, so the JVM cannot enforce the full array component contract for it.

`List<?>[]` can be created because `List<?>` is reifiable:

```java
List<?>[] lists = new List<?>[10];
```

In practical code, after the Collection module, you will often prefer collections over generic arrays when dynamic sizing is useful and an API does not require arrays. When an internal optimization or API contract truly requires an array, any unchecked cast should be isolated behind a clear invariant.
