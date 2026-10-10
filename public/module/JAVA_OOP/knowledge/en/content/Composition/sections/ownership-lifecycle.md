### Aggregation

The part can exist independently or be shared across owners. A `Team` may reference `Player` objects, while a `Player` does not necessarily cease to exist if the `Team` disappears.

### Composition

The whole conceptually owns the part more strongly. An `Order` may create and own its `OrderLine` objects; the line lifecycle is commonly tied to the order.

### HOW — Java does not enforce ownership semantics

The garbage collector only understands reachability. It does not know “aggregation” or “composition”. Ownership must be expressed through constructors/factories, mutability, APIs, and whether references are exposed or shared.
