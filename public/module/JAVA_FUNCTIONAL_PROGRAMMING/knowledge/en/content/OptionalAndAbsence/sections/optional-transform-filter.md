`map` transforms a present value. If the `Optional` is empty, the mapper is not called and the result stays empty.

```java
Optional<String> normalizedName = user
        .map(User::name)
        .map(String::trim);
```

If a mapping function already returns `Optional`, use `flatMap` to avoid producing `Optional<Optional<T>>`.

```java
Optional<Address> address = user.flatMap(User::address);
```

`filter` keeps a present value only when its predicate returns `true`; otherwise it produces an empty `Optional`.

```java
Optional<User> active = user.filter(User::isActive);
```

These operations are useful because absence automatically skips the transformation or predicate without an explicit null check at each step.
