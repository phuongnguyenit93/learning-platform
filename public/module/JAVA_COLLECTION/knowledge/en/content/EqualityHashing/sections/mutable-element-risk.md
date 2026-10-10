Hash-based and sorted collections assume that the state determining an element's/key's position does not silently change while it is stored.

Consider a mutable key:

```java
final class UserKey {
    long id;
    String region;

    UserKey(long id, String region) {
        this.id = id;
        this.region = region;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof UserKey that)) return false;
        return id == that.id && Objects.equals(region, that.region);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, region);
    }
}

UserKey key = new UserKey(10, "VN");
Map<UserKey, String> names = new HashMap<>();
names.put(key, "Phuong");

key.region = "SG"; // changes data used by hashCode/equals

System.out.println(names.get(key)); // the entry is no longer guaranteed to be found
```

The stored entry does not automatically move to the bucket associated with the new hash. Likewise, if an element in a `TreeSet` changes a field read by its comparator, the tree is not automatically re-sorted and lookup/order invariants can break.

A safer design is to use keys with stable identity, prefer immutable key objects, or remove an element before changing positioning state and insert it again afterwards. Mutating a `Map` **value** does not create this same key-position problem when the value does not participate in key identity, although application invariants still need to be maintained separately.
