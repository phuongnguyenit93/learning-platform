### WHAT — what is OOP?

Object-Oriented Programming organizes software around **objects**: each object represents a responsibility, owns some state, and exposes behavior so other objects can collaborate with it.

An object is not merely “a bag of fields”. A useful object answers three questions:

- what **state** does it own;
- what **responsibility** does it have;
- what **behavior** may callers request from it.

For a checkout flow:

```text
ShoppingCart
→ owns items and the rules for changing the cart

PricingPolicy
→ owns a pricing decision

PaymentMethod
→ owns payment behavior

CheckoutService
→ coordinates those objects to complete checkout
```

### RUNNING EXAMPLE — which model will continue through the module?

Most chapters will return to the same small set of roles so the learner can watch **one design evolve across concepts** instead of restarting in a new domain every time:

```text
Checkout / CheckoutService
→ coordinates the checkout flow

PaymentMethod
→ payment contract/behavior with multiple implementations

CardPayment / WalletPayment
→ concrete implementations for subtyping, polymorphism, and dispatch

Pricing
→ replaceable collaborator for composition, delegation, and abstraction
```

Supporting examples such as `Account`, `Team/Player`, or `Order/OrderLine` still appear when they demonstrate a specialized pitfall such as invariants or ownership/lifecycle more clearly. They are supporting examples, not separate curricula detached from the main checkout thread.

The key is that rules no longer need to be scattered across every caller. Callers send requests through methods; the responsible object protects its own state and rules.

### WHY — why not keep everything in one function?

Small procedural code is often perfectly readable. Problems appear when many operations read and mutate the same state and all know the same internal rules. Then a small change, such as adding a new discount policy, may require edits in many places.

OOP tries to **localize change**: pricing rules live near the pricing responsibility; state-validity rules live near the object that owns that state. That is why “an object owns behavior” matters more than merely splitting code into many classes.

### RELATION — how do the topics in this module fit together?

These milestones are not isolated definitions. They form one chain of questions:

```text
What Is Object-Oriented Programming (OOP) and Why Use It?
        ↓
An object owns state
        ↓
How does it keep that state valid?
Encapsulation and Invariants
        ↓
How can one type be treated as another compatible type?
Subtyping and Inheritance
        ↓
How can one contract produce different behavior?
Polymorphism and Dynamic Dispatch
        ↓
How does Java choose methods at compile time vs runtime?
How Java Selects Methods
        ↓
What if inheritance creates too much coupling?
Object Collaboration through Composition and Delegation
        ↓
What should callers know, and what should remain hidden?
Abstraction and Behavioral Contracts
        ↓
How do these choices fit together?
OOP Design Synthesis
```

`Encapsulation`, `inheritance`, `polymorphism`, and `abstraction` are commonly taught as the “four pillars of OOP”. Treat that as a useful mnemonic, not four unrelated keywords. They interact closely, and practical designs often use them together with composition, delegation, and clear responsibility boundaries.

### HOW — what does Java provide?

Java provides classes, objects, access modifiers, inheritance, interfaces, overriding, dynamic dispatch, and reference-based composition. But **language mechanisms do not automatically produce good design**. A class with only `private` fields may still encapsulate poorly; a hierarchy using `extends` may still be an invalid subtype design.

So keep two levels of reasoning separate:

```text
Design concept
→ responsibility, encapsulation, substitutability, abstraction...

Java mechanism
→ private, extends, implements, override, overload, runtime dispatch...
```

### PRACTICE — a review question

When reading a class, do not only ask “what fields and methods does it have?”. Ask: **what state does it own, what rules must it protect, and which callers currently know too much about its internals?**
