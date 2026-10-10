A lambda or method reference must obey the `throws` contract of its target function type. Standard interfaces such as `Function<T, R>` do not declare arbitrary checked exceptions.

```java
Function<Path, String> reader = path -> Files.readString(path); // does not compile
```

`Files.readString` can throw `IOException`, but `Function.apply` does not declare `IOException`. The lambda therefore cannot simply propagate that checked exception through this target type.

This is a type-contract issue, not a special weakness of lambda syntax. A named class implementing the same `Function` contract faces the same restriction.
