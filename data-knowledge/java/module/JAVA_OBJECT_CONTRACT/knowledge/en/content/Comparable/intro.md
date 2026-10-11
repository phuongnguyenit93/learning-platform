# Natural Ordering with Comparable

If a type has **one clear natural ordering**, the type itself can publish that ordering through `Comparable<T>`.

`Comparable` is not only about `Collections.sort`. Its contract also affects binary-search-style algorithms, `TreeSet`, `TreeMap`, and other APIs that rely on natural ordering.
