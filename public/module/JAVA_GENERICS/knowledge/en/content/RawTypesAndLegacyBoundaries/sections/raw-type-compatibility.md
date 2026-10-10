Given:

```java
class Box<T> {
    private T value;
    void set(T value) { this.value = value; }
    T get() { return value; }
}
```

`Box` without a type argument is the raw type:

```java
Box raw = new Box();
```

New code should normally use:

```java
Box<String> typed = new Box<>();
Box<?> unknown = typed;
```

`Box<?>` and raw `Box` are not equivalent. The wildcard says “there is a specific type argument that I do not know.” A raw type weakens or bypasses some generic checks for legacy compatibility.
