# hashCode and Hash-Based Lookup

`equals` can answer whether two objects are logically equal, but a `HashMap` would be inefficient if it had to compare every key with `equals`. `hashCode` gives hash-based collections a fast input they can use to narrow the set of candidates that may need equality checks.

Importantly, `hashCode` **does not replace `equals`**. It helps find likely candidates more efficiently.
