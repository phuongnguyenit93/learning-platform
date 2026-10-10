At the entry-chapter level, only their roles need to be clear:

- `SortedSet` / `SortedMap` add a contract that data is **observed through a maintained ordering**;
- `NavigableSet` / `NavigableMap` add nearest-neighbor and range-navigation capabilities;
- `TreeSet` and `TreeMap` are familiar implementations of these contracts.

Concrete operations such as `lower`, `floor`, `ceiling`, `higher`, `subSet`, and `subMap` become meaningful only after the learner understands `Set`, `Map`, and ordering. Their detailed mechanics therefore belong later in Ordering/Sorting rather than in the opening roadmap.
