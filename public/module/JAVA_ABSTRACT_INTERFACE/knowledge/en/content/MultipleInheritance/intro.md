# Multiple Interface Inheritance and Conflict Resolution

Java does not let one class extend several parent classes, but a class may implement several interfaces. Pure abstract contracts usually compose when their signatures are compatible. The interesting conflicts appear when multiple interfaces provide competing **default methods** for the same signature.

Read default-method resolution as an ordered process:

```text
Is there an override-equivalent class-side member?
→ static method: it cannot implement the interface instance method; the class is invalid if the conflict cannot be removed
→ instance method declared or inherited by the class:
   → concrete and compatible: use the class-side implementation
   → abstract: the interface default does not satisfy it automatically; the concrete subclass must implement it
   → concrete but incompatible with the interface contract: the class must provide a compatible override when possible; otherwise compilation fails

If there is no relevant class-side member above, is one interface default more specific than the others?
→ yes: use the more-specific default

Do independent competing defaults still remain?
→ yes: the implementing class must override and resolve the conflict explicitly
```
