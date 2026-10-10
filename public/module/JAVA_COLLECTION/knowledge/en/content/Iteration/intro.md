# Traversal and Iteration

After choosing a data structure, most algorithms still need to visit its elements. If every caller had to understand how arrays, nodes, trees, or hash buckets were stored internally, code would become tightly coupled to implementations. Java separates the **traversal protocol** from the **storage structure** through `Iterable`, `Iterator`, `ListIterator`, and `Spliterator`.
