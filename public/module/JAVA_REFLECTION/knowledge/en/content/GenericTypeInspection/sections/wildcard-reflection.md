Wildcards express compile-time variance relationships, and their bounds are retained in generic metadata.

For this field:

```java
List<? extends T> values;
```

the type argument is a `WildcardType` whose upper bound is `T` and which has no useful lower bound. For:

```java
List<? super Integer> sinks;
```

the wildcard has `Integer` as its lower bound, while its upper bound remains `Object`.

They can be inspected directly:

```java
ParameterizedType listType = (ParameterizedType)
        Repository.class.getDeclaredField("sinks").getGenericType();

WildcardType wildcard = (WildcardType) listType.getActualTypeArguments()[0];

System.out.println(Arrays.toString(wildcard.getUpperBounds()));
System.out.println(Arrays.toString(wildcard.getLowerBounds()));
```

Reflection exposes metadata about the **declared constraint**. It does not turn a wildcard into one concrete runtime class. A framework resolving a generic type tree must understand upper/lower bounds and continue resolving nested `Type` values as needed.
