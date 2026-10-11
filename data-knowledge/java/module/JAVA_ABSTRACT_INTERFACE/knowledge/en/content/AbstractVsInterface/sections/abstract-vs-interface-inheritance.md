A Java class may extend only one class:

```text
class inheritance
→ one direct superclass
```

but it may implement multiple interfaces:

```text
interface implementation
→ several independent roles/capabilities may be combined
```

That makes interfaces useful for roles that cross unrelated class hierarchies, such as `Comparable`, `AutoCloseable`, `Serializable`, or a domain capability like `Refundable`.
