The useful way to learn the hierarchy is to connect each interface to a question, rather than memorize a tree of names.

```text
Iterable<E>
    ↓
Collection<E>
    ├── List<E>        → ordered, positional, duplicates allowed
    ├── Set<E>         → uniqueness
    │     └── SortedSet<E>       → sorted set contract
    │            └── NavigableSet<E> → neighbor navigation
    └── Queue<E>       → insertion/removal behavior for processing
          └── Deque<E> → operations at both ends

Map<K, V>              → key → value association on a separate branch
    └── SortedMap<K, V>       → sorted-key map contract
           └── NavigableMap<K, V> → neighbor navigation by key
```

`Collection<E>` extends `Iterable<E>`, giving collections a common traversal protocol. `List`, `Set`, and `Queue` refine the contract for different uses. `SortedSet` and `NavigableSet` progressively add sorted and neighbor-navigation behavior. On the separate map branch, `SortedMap` and `NavigableMap` do the equivalent work for keys. `Deque` is a queue-like contract with two ends.

After that basic hierarchy is clear, Java 21 adds **sequenced interfaces** that give structures with a defined encounter order a common first/last/reversed vocabulary:

```text
SequencedCollection<E>
├── List<E>
├── Deque<E>
└── SequencedSet<E>

SequencedMap<K, V>     → ordered first/last behavior on the Map branch
```

There are a few bridge relationships worth reading precisely: `List` extends `SequencedCollection`; `Deque` is both a `Queue` and a `SequencedCollection`; and `SequencedSet` is both a `Set` and a `SequencedCollection`. These interfaces give ordered collections a common vocabulary such as `getFirst()`, `getLast()`, and `reversed()`. They do not change the fundamental decision: choose the contract that matches the data behavior first.

In Java 21, `SortedSet` also extends `SequencedSet`, while `SortedMap` also extends `SequencedMap`. As a result, `TreeSet` and `TreeMap` expose sequenced behavior through their sorted/navigable interfaces without losing their main sorted-navigation contract.
