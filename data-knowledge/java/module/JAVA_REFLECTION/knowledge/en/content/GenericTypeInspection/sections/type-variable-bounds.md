In `Repository<T extends Number & Comparable<T>>`, `T` is a `TypeVariable` declared by `Repository`.

```java
TypeVariable<Class<Repository>> variable = Repository.class.getTypeParameters()[0];

System.out.println(variable.getName()); // T

for (Type bound : variable.getBounds()) {
    System.out.println(bound.getTypeName());
}
```

The bounds reflect the declaration constraints:

```text
java.lang.Number
java.lang.Comparable<T>
```

If source code declares only `<T>`, its implicit upper bound is `Object`. A `TypeVariable` can also report the generic declaration that owns it through `getGenericDeclaration()`.

Type variables do not belong only to classes. Generic methods and constructors can declare their own variables because both `Method` and `Constructor` are `Executable` values:

```java
class Converter {
    public <R> R convert(Object source, Class<R> targetType) {
        return targetType.cast(source);
    }
}

Method convert = Converter.class.getMethod(
        "convert",
        Object.class,
        Class.class
);

TypeVariable<Method>[] methodVariables = convert.getTypeParameters();
System.out.println(methodVariables[0].getGenericDeclaration() == convert); // true
```

`getGenericDeclaration()` therefore tells framework code which declaration owns `T` or `R`, not merely the variable's name.

A common mistake is to see `T` and then search for “the real runtime class of T.” Reflection is describing the **type variable in a declaration**; it does not automatically know whether some particular object was originally created as `Repository<Integer>` or `Repository<Long>`.
