Arrays are another form of **metadata-driven operation**. Ordinary Java syntax places the component type directly in source:

```java
String[] values = new String[3];
```

A framework may instead receive a `Class<?> componentType` from configuration, a schema, or a mapping resolved at runtime. `java.lang.reflect.Array` can create the array without hard-coding that component type:

```java
Class<?> componentType = String.class;
Object array = Array.newInstance(componentType, 3);

Array.set(array, 0, "A");
Array.set(array, 1, "B");

Object first = Array.get(array, 0);
System.out.println(first); // A
```

The runtime type of `array` is still `String[]`, even though the compile-time variable in this example is `Object`:

```java
System.out.println(array.getClass());                    // class [Ljava.lang.String;
System.out.println(array.getClass().isArray());          // true
System.out.println(array.getClass().getComponentType()); // class java.lang.String
```

`Array` also supports primitive arrays. Helpers such as `getInt(...)`, `setInt(...)`, and the corresponding primitive-specific methods allow access without first casting to a statically known primitive-array type:

```java
Object numbers = Array.newInstance(int.class, 2);

Array.setInt(numbers, 0, 10);
Array.setInt(numbers, 1, 20);

System.out.println(Array.getInt(numbers, 1)); // 20
```

Multidimensional arrays can be created with the overload that accepts multiple dimensions:

```java
Object matrix = Array.newInstance(String.class, 2, 3);
System.out.println(matrix.getClass()); // class [[Ljava.lang.String;
```

Reflection does not remove array type rules. Invalid indexes still fail, incompatible values are still rejected at runtime, and negative dimensions remain invalid. `Array` only moves the **component type + dimensions + access** decision from compile-time syntax to runtime metadata.

~~~text
component type known at compile time
→ new T[length]

component type known only at runtime
→ Array.newInstance(componentType, length)
→ Array.get / Array.set
~~~
