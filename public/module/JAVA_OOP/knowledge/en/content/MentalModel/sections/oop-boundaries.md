### WHAT — what is a boundary?

A boundary separates “what this object is responsible for” from “what callers are allowed to know or request”. A good boundary exposes meaningful behavior while keeping irrelevant implementation details inside.

For checkout, a caller should prefer:

```java
checkoutService.checkout(cart);
```

over reading every field from `ShoppingCart`, calculating prices itself, branching on payment type, and then mutating order state directly.

### WHY — why do responsibility boundaries matter?

When related state and rules live behind one boundary, cohesion improves: there is a clear place to find the logic. When many objects know each other's internals, coupling increases: changing one side can force changes across the system.

Good OOP does not mean “more classes are always better”. Splitting one responsibility into layers that add no real boundary only creates navigation cost.

### RELATION — boundaries lead to encapsulation

As soon as we say “this object owns state”, the next question is: **who is allowed to change that state?** That is the bridge to encapsulation. Encapsulation is not merely `private`; it uses a boundary to control valid state transitions.

A useful heuristic:

```text
If a caller must know many fields to implement one rule
→ that responsibility may live behind the wrong boundary.
```

### PRACTICE — three boundary questions

For each class, ask:

1. which state truly belongs to this responsibility;
2. which behavior does a caller need, rather than which raw data it wants;
3. if the internal representation changes, how many callers must change too.
