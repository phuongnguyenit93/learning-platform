### WHY — inheritance is powerful but strongly coupling

A subclass may depend not only on a public contract but also on initialization order, protected hooks, and assumptions about base-class behavior.

For example, a superclass constructor can call an overridable method and dynamic dispatch can reach subclass behavior **before subclass state is fully initialized**. A subclass reference field may still hold its default `null` value, so subclass code that assumes initialization is complete can throw `NullPointerException`.

The detailed execution mechanics and runnable example belong to `class-object → Object Creation Lifecycle → Dynamic Dispatch During Construction`. The OOP lesson is the **coupling consequence**: a subclass can depend on **lifecycle order and internal execution decisions of the base class**, not only public signatures. That is one form of fragile-base risk.

### TRADE-OFF — when is inheritance justified?

Inheritance is a stronger fit when:

- the subtype relationship is meaningful in behavior;
- callers genuinely need substitutability;
- the base class exposes a stable contract;
- the subclass does not have to override large parts of the base merely to escape its assumptions.

Inheritance is suspicious when the main reason is “avoid copying a few methods”. In that case composition/delegation is often more explicit and less coupled.

### RELATION — from inheritance to polymorphism

Once a `PaymentMethod` reference may point to `CardPayment`, `WalletPayment`, or another implementation, callers should not need `if (payment instanceof ...)` for every type. **Polymorphism** addresses exactly that problem.
