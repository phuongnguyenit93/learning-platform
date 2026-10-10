The same `Book` values may be sorted by:

- title;
- publication date;
- price;
- rating;
- a compound business key.

The domain class should not need to change for every view:

```java
Comparator<Book> byTitle =
        Comparator.comparing(Book::title);

Comparator<Book> byPrice =
        Comparator.comparing(Book::price);
```

Choosing `byTitle`, `byPrice`, or another comparator changes **how callers order the books**. It does not rewrite `Book.equals` or redefine the type's domain equality. Ordering and logical equality are separate policies even when a sorted collection makes their interaction observable.

A correct `Comparator` also imposes a **total order** over the set of values it is designed to compare. If the policy permits `null`, the comparator itself must define where `null` belongs in that order.

### NATURAL ORDER AND BUSINESS VIEW ARE NOT THE SAME THING

A type may have a natural order and still need contextual comparators.

For example, `Version` may naturally order by semantic version while a UI needs to display releases by date. `Comparable` should not be redefined merely to serve one screen.
