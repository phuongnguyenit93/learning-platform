OOP can now be seen as one continuous flow:

```text
Object owns state + responsibility
→ Encapsulation keeps state transitions valid
→ Subtyping creates a common type relationship
→ Polymorphism provides one contract with many behaviors
→ Overriding + dynamic dispatch are key Java runtime mechanisms
→ Composition/delegation vary behavior through collaborators instead of deeper hierarchies
→ Abstraction keeps the essential contract and reduces caller knowledge
```

`Overloading` appears in this module to distinguish compile-time method selection from runtime polymorphism; it is not a separate OOP pillar.

### DECISION MODEL — how should these tools work together?

The concepts in this module are not a checklist to apply mechanically. They answer different design questions:

```text
Does an object own state that must remain valid?
→ use encapsulation to control valid state transitions

Must one type genuinely be usable as a more general type?
→ consider subtyping and inheritance

Does a caller need one contract with multiple implementations?
→ use polymorphism and substitutability

Is the goal only to assemble or vary behavior without a subtype relationship?
→ prefer composition and delegation

Does a caller know too many implementation details?
→ introduce a stable abstraction/contract at the right boundary
```

Inheritance and composition are not globally mutually exclusive. A design may use inheritance where a real subtype relationship exists and composition where objects only need to collaborate. Abstraction can sit around either choice so consumers depend on stable contracts rather than implementation details.

### TRADE-OFF — when is a richer object model unnecessary?

For a short data transformation, a pure algorithm, or a linear flow with no meaningful long-lived state, invariants, or variation points, adding many classes, interfaces, and delegation layers may increase ceremony without improving the design.

The goal of OOP is not to maximize the number of objects. It is to create **responsibility boundaries that make software easier to understand and change**. If an abstraction, hierarchy, or collaborator creates no meaningful boundary or variation point, reconsider whether it is needed.

### PRACTICE — end-of-module review criteria

When reviewing an OOP design, do not count classes or interfaces. Ask:

1. are responsibilities clear;
2. does state/invariant have a clear owner;
3. are subtypes genuinely substitutable;
4. is inheritance vs composition chosen for the right reason;
5. do callers depend on unnecessary implementation details.

If you can answer those five questions, you have a more useful OOP mental model than memorizing only “the four pillars”.
