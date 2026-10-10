### WHAT — one contract, multiple behaviors

Subtype polymorphism lets code depend on a supertype while working with many concrete implementations.

```java
PaymentMethod payment = new CardPayment();
payment.pay(1000);
```

`CheckoutService` only needs the `PaymentMethod` contract; it does not necessarily need to know whether the runtime object is card, wallet, or bank transfer.

### JAVA MODEL — polymorphism does not require class inheritance

`PaymentMethod` may be an `interface`:

```java
interface PaymentMethod {
    void pay(int amount);
}

class CardPayment implements PaymentMethod {
    @Override
    public void pay(int amount) {
        System.out.println("card: " + amount);
    }
}

PaymentMethod payment = new CardPayment();
payment.pay(1000);
```

There is no `CardPayment extends PaymentMethod`, yet the full polymorphic chain still exists:

```text
CardPayment implements PaymentMethod
→ CardPayment is a subtype of PaymentMethod
→ a PaymentMethod variable can reference CardPayment
→ instance-method calls still dispatch from the runtime receiver
```

This distinction matters: **subtype polymorphism is broader than class inheritance**. Class inheritance is one way to create a subtype; implementing an interface is another. Detailed interface rules belong to `abstract-interface`.

### MENTAL MODEL — static type vs runtime type

With:

```java
PaymentMethod payment = new CardPayment();
```

keep two layers separate:

```text
PaymentMethod payment
↑ static / declared type

new CardPayment()
↑ runtime type / actual object
```

The static type tells the compiler **which members are legal through the expression `payment`**. The runtime type matters when a legal instance-method call has multiple overridden implementations.

For example:

```java
Animal animal = new Dog();

animal.sound(); // legal if Animal declares sound()
animal.bark();  // compile error if Animal does not declare bark()
```

Even though the runtime object is a `Dog`, the compiler does not allow `bark()` through an `Animal` reference merely because the runtime class has that method.

### WHY — remove type-specific branching from callers

The design becomes easier to extend when a new implementation can be added without adding a branch to every existing caller:

```text
Without polymorphism
→ if card ... else if wallet ... else if bank ...

With polymorphism
→ payment.pay(amount)
```

This does not mean every `if` is bad. The benefit appears when a caller is branching on object type only to choose behavior that the object itself could provide.

### RELATION — polymorphism needs a contract and substitutability

Runtime dispatch is useful only if the implementations actually honor a common contract. If every subtype has incompatible preconditions or semantics, callers still need special cases and the polymorphism is mostly cosmetic.
