When you write:

```java
Box<String> box = new Box<>();
```

the `<String>` on the left makes the variable type `Box<String>`. The empty `<>` on `new Box<>()` is informally called the **diamond operator**.

The compiler infers the **type arguments of the generic class being instantiated** from context:

```java
Box<String> box = new Box<>();
// same generic type as:
Box<String> other = new Box<String>();
```

Diamond is not the same as a raw type, and it is separate from any type parameters declared by a generic constructor:

```java
Box<String> safe = new Box<>(); // generic; String is inferred
Box<String> risky = new Box();  // raw Box -> unchecked conversion warning
```

For beginner code, the practical rule is simple: when the compiler can infer the type argument for a generic object creation, prefer `<>` rather than repeating the type argument.

### When only one method needs to be generic

`Box<T>` needs a type parameter because the **whole object** works with one type `T`. But many classes do not need to be generic at all; only **one method** may have logic that is identical across data types.

Without a generic method, that can lead to duplicated operations:

```java
static String echoString(String value) { return value; }
static Integer echoInteger(Integer value) { return value; }
```

The algorithm is unchanged; only the data type differs. There is no reason to turn the whole utility class into `Util<T>` just for this operation.

A **generic method** gives the method its own type slot:

```java
static <T> T echo(T value) {
    return value;
}
```

One method now works with `String`, `Integer`, `User`, and more, while preserving the relationship: **pass a T, get a T back**.
