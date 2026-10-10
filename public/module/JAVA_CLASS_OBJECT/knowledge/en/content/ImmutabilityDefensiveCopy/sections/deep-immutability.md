`final List<Address> addresses` is not deeply immutable if the list or `Address` instances remain mutable. `final` fixes the field reference; it does not recursively freeze the referenced object graph.

```text
shallow immutability
→ the outer object's directly observable state does not change
→ but referenced child objects may still be mutable

deep immutability
→ immutability extends through the relevant reachable state that must be protected
```

Not every domain needs deep immutability, but ownership and mutation boundaries should be explicit.

The next chapter collects the complete module into one end-to-end model and makes the handoff to OOP, Object Contract, Reflection, and ClassLoader explicit.
