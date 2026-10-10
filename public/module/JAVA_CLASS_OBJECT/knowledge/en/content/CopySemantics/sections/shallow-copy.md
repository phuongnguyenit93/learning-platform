A shallow copy creates a new outer object but copies its field values as they are.

Reference fields are copied as references, so nested mutable objects may still be shared. Suppose `BankAccount` owns a mutable list of tags and its copy constructor copies that list reference directly:

```java
class BankAccount {
    private final String id;
    private final List<String> tags;

    BankAccount(String id, List<String> tags) {
        this.id = id;
        this.tags = tags;
    }

    BankAccount(BankAccount source) {
        this(source.id, source.tags); // shallow: same list reference
    }

    List<String> tags() {
        return tags;
    }
}

BankAccount original = new BankAccount("A-01", new ArrayList<>());
BankAccount copy = new BankAccount(original);

copy.tags().add("VIP");

System.out.println(original.tags()); // [VIP]
```

The two `BankAccount` objects have different identities, but both still refer to the same mutable list.
