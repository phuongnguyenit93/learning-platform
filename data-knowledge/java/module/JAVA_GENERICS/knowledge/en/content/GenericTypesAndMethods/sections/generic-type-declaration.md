A generic class declares its type parameter after the class name:

```java
final class Box<T> {
    private T value;

    void set(T value) {
        this.value = value;
    }

    T get() {
        return value;
    }
}
```

At a use site, a concrete type argument forms a parameterized type:

```java
Box<String> textBox = new Box<>();
Box<Integer> numberBox = new Box<>();
```

A generic type is not limited to a class. An interface may also declare type parameters:

```java
interface Repository<ID, T> {
    T findById(ID id);
    void save(T value);
}
```

An implementation may keep the parameters generic or fix them to concrete types:

```java
class User {}

final class UserRepository implements Repository<Long, User> {
    @Override
    public User findById(Long id) {
        return null;
    }

    @Override
    public void save(User value) {
    }
}
```

`ID` and `T` are both type parameters of `Repository`. Another implementation could keep them generic instead of fixing them immediately to `Long` and `User`.

The key idea is not the `<T>` syntax by itself. It is **a type relationship owned by the declaration and reused consistently across members**.
