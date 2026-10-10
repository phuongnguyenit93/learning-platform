A **modifiable** collection supports mutation operations allowed by its contract, such as `add`, `remove`, or `clear`. An **unmodifiable view** rejects mutation through the view, usually with `UnsupportedOperationException`, while the source behind that view may still change.

```java
List<Order> source = new ArrayList<>();
source.add(new Order(1, 1, 20_000));

List<Order> view = Collections.unmodifiableList(source);

// view.add(...) -> UnsupportedOperationException
source.add(new Order(2, 2, 10_000));

System.out.println(view.size()); // 2: the view sees source changes
```

So “unmodifiable” does not mean “can never change”. It means this reference or view does not provide a structural mutation path.

Java 21 extends the same idea to sequenced collections with `Collections.unmodifiableSequencedCollection`, `unmodifiableSequencedSet`, and `unmodifiableSequencedMap`. These wrappers preserve encounter-order/first-last semantics while rejecting mutation through the wrapper.
