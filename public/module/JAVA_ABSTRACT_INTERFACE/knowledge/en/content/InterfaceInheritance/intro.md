# Interface Inheritance and Contract Composition

An interface may represent one small capability. Larger APIs can compose those capabilities into broader contracts through **interface inheritance**.

Putting every behavior into one large interface can force implementers to depend on capabilities they do not need. Smaller roles keep contracts focused:

```text
Payable
Refundable
Auditable
```

A broader contract can then compose only the roles it actually needs. Interface inheritance is therefore more than `extends` syntax: it is a way to **compose contracts** while preserving clear capability boundaries.
