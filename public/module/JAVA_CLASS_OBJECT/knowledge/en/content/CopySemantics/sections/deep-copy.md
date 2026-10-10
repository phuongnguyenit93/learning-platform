A deep copy tries to create independent mutable state where ownership requires it. In the running example, the copy constructor could instead use `new ArrayList<>(source.tags)` to give the copied account its own list.

There is no universal deep-copy algorithm for every object graph. The design must decide which nested values are copied, which immutable values may be shared, and how cycles/identity are treated.

Deep copying is therefore an ownership/domain decision rather than blindly cloning everything recursively.
