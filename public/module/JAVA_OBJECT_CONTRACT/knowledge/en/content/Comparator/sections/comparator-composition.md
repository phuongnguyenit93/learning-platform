Java provides factory and composition helpers that let you describe ordering as a sequence of policies.

```java
Comparator<Book> byTitleThenDate =
        Comparator.comparing(Book::title)
                  .thenComparing(Book::publishedAt);
```

### TIE-BREAKERS

If a comparator only checks title:

```text
Book("Java", 2022)
Book("Java", 2024)
```

it may return `0` even though the two books are different domain values. For list sorting that simply means they tie under this comparator. For `TreeSet`/`TreeMap`, `compare(...) == 0` may cause them to be treated as the same ordering key.

Design tie-breakers intentionally:

```java
Comparator<Book> byTitleThenDateThenId =
        Comparator.comparing(Book::title)
                  .thenComparing(Book::publishedAt)
                  .thenComparing(Book::id);
```

### PRIMITIVE-SPECIALIZED HELPERS

When the key is primitive, specialized helpers avoid unnecessary boxing and express intent clearly:

```java
Comparator<Book> byPages =
        Comparator.comparingInt(Book::pages);

Comparator<Book> bySales =
        Comparator.comparingLong(Book::sales);

Comparator<Book> byRating =
        Comparator.comparingDouble(Book::rating);
```

### `reversed()` AND COMPOSITION ORDER

```java
Comparator<Book> newestFirst =
        Comparator.comparing(Book::publishedAt)
                  .reversed();
```

Read comparator expressions as policy pipelines. The position of `reversed()` matters, especially once several comparison stages are composed.

For example, these two policies are different:

```java
// Reverse the complete chain: title descending, then date descending.
Comparator<Book> allDescending =
        Comparator.comparing(Book::title)
                  .thenComparing(Book::publishedAt)
                  .reversed();

// Keep title ascending, but reverse only the date tie-breaker.
Comparator<Book> titleAscDateDesc =
        Comparator.comparing(Book::title)
                  .thenComparing(
                          Comparator.comparing(Book::publishedAt).reversed()
                  );
```

Composition therefore expresses **which criterion is primary, which criterion only breaks ties, and which part of the policy is reversed**. Reversing a composed comparator is not the same operation as reversing one individual comparison stage.

### NULL HANDLING IS AN EXPLICIT POLICY

```java
Comparator<Book> byTitleNullLast =
        Comparator.comparing(
                Book::title,
                Comparator.nullsLast(Comparator.naturalOrder())
        );
```

`nullsFirst` and `nullsLast` let the caller state null semantics explicitly instead of relying on accidental failure.
