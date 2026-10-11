APIs often need to say "there may be no value". Returning `null` can express that, but the absence is easy to overlook because the type itself does not remind the caller to handle it.

`Optional<T>` makes possible absence explicit in the return type. A useful mental model is a container with either one non-null value or no value.

```java
Optional<User> findUser(String id) {
    // returns Optional.empty() when the user is not found
}
```

`Optional` does not eliminate `null` from Java and is not a universal wrapper for every reference. Its value is strongest at selected API boundaries where absence is a normal, expected outcome.
