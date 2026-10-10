### CONCEPT

Suppose checkout depends directly on `CardPayment`:

```java
void checkout(CardPayment payment) {
    payment.pay(100);
}
```

That works, but the consumer is tied to one concrete implementation. If the system later adds `WalletPayment`, `BankTransferPayment`, or another payment mechanism, the caller should ideally depend on **the payment contract**, not each implementation class.

Java can model that need with a common type. This module focuses on two important tools:

```text
abstract class
→ useful when a closely related family of classes shares state, initialization rules, or partial implementation

interface
→ useful when a role/capability should be expressed as a contract
→ unrelated class hierarchies can still implement the same contract
```

### WHY

The purpose of these mechanisms is **not merely to create types that cannot be instantiated directly**. The more important design move is to separate three needs:

```text
What does the consumer need to know?
→ contract

What do related implementations need to share?
→ state / initialization rules / implementation

What additional role may a class need to play?
→ capability expressed by an interface
```

Keeping those concerns distinct reduces dependence on concrete classes and makes the type model easier to extend.
