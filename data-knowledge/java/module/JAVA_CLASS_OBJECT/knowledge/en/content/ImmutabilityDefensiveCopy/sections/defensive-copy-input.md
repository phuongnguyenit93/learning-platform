If a constructor stores a mutable input reference directly, the caller can mutate internal state after construction.

```java
this.tags = new ArrayList<>(tags);
```

Copying input separates the snapshot's ownership from the caller's mutable collection:

```java
List<String> source = new ArrayList<>();
BankAccountSnapshot snapshot = new BankAccountSnapshot("A-01", source);

source.add("VIP");
System.out.println(snapshot.tags()); // []
```

Immutable inputs such as `String` do not need defensive copying merely for appearance.
