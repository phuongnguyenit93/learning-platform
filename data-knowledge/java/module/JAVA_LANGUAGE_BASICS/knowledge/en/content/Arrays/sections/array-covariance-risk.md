Reference arrays are covariant:

```java
String[] strings = new String[1];
Object[] objects = strings;
```

But the runtime array remains `String[]`, so storing an `Integer` through `objects` throws `ArrayStoreException`.

The compiler accepts the type relation; runtime preserves the real component type.

Why can the failure happen at runtime? The variable may have static type `Object[]`, while the actual array object remains `String[]`. The JVM checks stores against that runtime component type:

```text
compile-time view: Object[]
runtime object:     String[]
store Integer
        ↓
ArrayStoreException
```
