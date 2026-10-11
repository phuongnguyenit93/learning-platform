A useful conceptual model:

```text
source contains T / List<String> / bounds
        ↓
compiler checks generic constraints
        ↓
type variables such as T erase to their bound or Object
parameterized types such as List<String> erase to List
        ↓
compiler inserts casts where needed
        ↓
bytecode operates on ordinary runtime types
```

Keep two erasure rules distinct:

```text
T
→ erases to its leftmost bound when one exists
→ otherwise commonly erases to Object

List<String>
→ the String type argument is absent from the execution type
→ the parameterized type erases to List
```

So “erases to `Object`” is **not** a rule for every generic type. It mainly describes an unbounded type variable; a parameterized type such as `List<String>` erases to the corresponding raw type `List`.

For:

```java
class Box<T> {
    T value;
    T get() { return value; }
}
```

Conceptually, an unbounded `T` erases toward:

```java
class Box {
    Object value;
    Object get() { return value; }
}
```

A typed caller such as:

```java
String s = box.get();
```

is protected by compile-time checking plus the casts the compiler emits where necessary.

If `T extends Number`, the erasure of `T` is based on its leftmost bound `Number`, not always `Object`.

With multiple bounds, the same rule uses the **first bound**:

```java
<T extends Number & Comparable<T>>
```

so the erasure of `T` is `Number`. This is the deeper reason the Bounded Type Parameters chapter requires a class bound, when present, to come before interface bounds.
