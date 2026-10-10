Equality matters beyond `HashSet` and `HashMap`. Many collection operations use `equals` to decide whether something matches:

- `List.contains(x)` and `List.remove(x)` locate elements through equality.
- `HashSet` uses `hashCode` to narrow the candidate area and `equals` to confirm the actual match.
- `HashMap` applies the same idea to keys.
- Equality of `List` and several other collections is built from equality of their elements.

For a simple record, Java derives equality from all record components:

```java
record User(long id, String email) {}

List<User> users = new ArrayList<>();
users.add(new User(10, "a@example.com"));

System.out.println(users.contains(new User(10, "a@example.com"))); // true
```

If the business means “users with the same id have the same identity” but `equals` also includes email, the collection will follow the Java contract that was encoded, not the business rule that was only intended. Check the element equality model before blaming the collection.
