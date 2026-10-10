Using `null` as though it identifies an object, such as `name.length()`, causes `NullPointerException`.

NPE often reflects an unclear boundary/invariant rather than merely the existence of `null`: the API did not state whether absence was allowed, or code violated the expected state.

Dereference can also be indirect:

```java
user.getName();
```
