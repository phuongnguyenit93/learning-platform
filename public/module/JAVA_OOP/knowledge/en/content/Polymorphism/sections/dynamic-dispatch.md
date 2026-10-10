### HOW — how does Java choose a method?

For an overridden **instance method**, Java separates two decisions:

```text
Compile time
→ reference type + argument types determine a valid method signature

Runtime
→ receiver runtime class determines the concrete override body
```

Example:

```java
PaymentMethod payment = new CardPayment();
payment.pay(1000);
```

The compiler verifies that `PaymentMethod` exposes a matching `pay(...)`. At runtime, if `CardPayment` overrides that method, the `CardPayment` body is dispatched.

### HOW — calls inside an object still dispatch from the runtime receiver

Dynamic dispatch is not limited to calls made directly by external code. A superclass method that calls another overridable instance method through `this` is still operating on the **same runtime object**:

```java
class PaymentMethod {
    void execute(int amount) {
        pay(amount); // virtual call on this
    }

    void pay(int amount) {
        System.out.println("generic");
    }
}

class CardPayment extends PaymentMethod {
    @Override
    void pay(int amount) {
        System.out.println("card: " + amount);
    }
}

PaymentMethod payment = new CardPayment();
payment.execute(1000);
```

The flow is:

```text
payment.execute(...)
→ PaymentMethod.execute(...) runs
→ execute calls this.pay(...)
→ runtime receiver is still CardPayment
→ CardPayment.pay(...) runs
```

So do not assume that “because execution is currently inside `PaymentMethod`, every internal method call is fixed to `PaymentMethod`”. For overridable instance methods, the runtime receiver still determines the final implementation.

### EVIDENCE — `PolymorphismController#dispatch()`

The module experiment uses:

```java
Speaker first = new Dog();
Speaker second = new Cat();
```

Both variables have declared type `Speaker`, yet `first.speak()` uses `Dog` behavior and `second.speak()` uses `Cat` behavior.

The key observation is **the same declared type with different runtime behavior**.

### BOUNDARY — not every member uses dynamic dispatch

Instance overrides are dynamically dispatched. Static methods and fields are not. The Overloading/Overriding chapter makes that distinction explicit.
