Even correct methods can become operationally unsafe if equality state changes after insertion:

```text
correct equals/hashCode implementation
        +
mutable key state
        ↓
lookup can still fail
```

If a field used by `equals`/`hashCode` changes after insertion into a `HashMap` or `HashSet`, the object remains stored according to the structure created from its old state while a later lookup may follow a different search path derived from the new hash.

```java
final class UserKey {
    String value;

    UserKey(String value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object other) {
        return other instanceof UserKey that
                && Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}

UserKey key = new UserKey("U-100");
Set<UserKey> set = new HashSet<>();
set.add(key);

key.value = "U-200";

System.out.println(set.contains(key)); // may now be false
```

Mental model:

```text
insert
hash("U-100")
→ collection places/searches according to hash path A

mutate key
hash("U-200")
→ later lookup may follow hash path B

the object is still stored according to the old placement
```

The result can be that `contains/get/remove` cannot find an object that is physically still stored in the collection.

### SAFE PRACTICE

Prefer immutable keys, or at least do not mutate equality/hash state while an object is being used as a key.

So key design asks more than “are the methods implemented correctly?” It also asks:

> Does equality-relevant state remain stable while the object is stored in the collection?

The next chapter moves from collection equality to a human-facing contract: **how an object should describe itself for diagnostics**.
