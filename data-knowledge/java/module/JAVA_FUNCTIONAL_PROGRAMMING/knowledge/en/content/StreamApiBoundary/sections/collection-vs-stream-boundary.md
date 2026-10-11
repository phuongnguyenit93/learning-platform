A `Collection` is primarily a data structure that owns or provides access to elements. A `Stream` is an API abstraction used to describe processing over a source of elements; it is not simply another collection type.

From the functional-programming perspective, the useful observation is that Stream processing is parameterized by behavior. The source may come from a collection, but the `Predicate`, `Function`, or `Consumer` passed to Stream methods remains the same kind of functional-interface value learned in this module.

Questions such as when elements are processed, how operations are categorized, or how results are accumulated require Stream-specific rules and should be learned in the dedicated module.
