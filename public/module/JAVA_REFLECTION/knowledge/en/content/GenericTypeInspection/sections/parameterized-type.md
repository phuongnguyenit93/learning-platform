`ParameterizedType` represents declarations such as `List<String>`, `Map<String, PaymentRequest>`, or `List<? extends T>`.

```java
Field field = Repository.class.getDeclaredField("values");
Type type = field.getGenericType();

if (type instanceof ParameterizedType parameterized) {
    System.out.println(parameterized.getRawType());

    for (Type argument : parameterized.getActualTypeArguments()) {
        System.out.println(argument.getTypeName());
    }
}
```

Here the structure is:

```text
raw type        → java.util.List
actual argument → ? extends T
```

`getActualTypeArguments()` may itself return a `Class`, `ParameterizedType`, `TypeVariable`, `WildcardType`, or another type structure. Framework code therefore often walks `Type` as a tree instead of blindly casting every argument to `Class<?>`.

`ParameterizedType` also exposes `getOwnerType()` for nested/member types whose owner is parameterized. That is not central to this example, but it reinforces that a generic signature can be a multi-level structure.
