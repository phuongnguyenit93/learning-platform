`java.lang.reflect.Type` is the common interface for the type shapes returned by generic reflection. The important rule is that a `Type` is not necessarily a `Class<?>`.

The main forms are:

- `Class<?>`: a type represented directly by a runtime `Class`, such as `String`, raw `List`, `int`, or `String[]`;
- `ParameterizedType`: a declaration with type arguments, such as `List<String>`;
- `TypeVariable<?>`: a type variable such as `T` in `Repository<T>`;
- `WildcardType`: a wildcard such as `? extends T` or `? super Integer`;
- `GenericArrayType`: an array whose component type is a generic type shape that cannot be represented by `Class<?>` alone, such as `T[]`.

For example:

```java
for (Field field : Repository.class.getDeclaredFields()) {
    Type raw = field.getType();
    Type generic = field.getGenericType();

    System.out.println(field.getName());
    System.out.println("raw     = " + raw.getTypeName());
    System.out.println("generic = " + generic.getTypeName());
}
```

For `values`, `getType()` returns `List.class`, while `getGenericType()` describes `List<? extends T>`. For `buffer`, the erased raw type is `Number[]`, while the generic metadata represents `T[]` as a `GenericArrayType`.

This is why generic reflection APIs return `Type`: `Class<?>` alone cannot represent a nested generic structure.
