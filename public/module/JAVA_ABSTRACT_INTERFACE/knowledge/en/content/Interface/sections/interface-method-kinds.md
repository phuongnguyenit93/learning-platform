Modern Java interfaces may contain several method kinds:

| Kind | Role |
| --- | --- |
| abstract instance method | contract the implementation must satisfy |
| `default` method | inheritable default instance behavior |
| `static` method | behavior attached to the interface type |
| `private` method | internal helper; may be instance or `static` |

An abstract instance method with no explicit access modifier is implicitly `public abstract`:

```java
interface PaymentMethod {
    void pay(int amount); // public abstract
}
```

An implementing class therefore cannot reduce the method's visibility:

```java
class CardPayment extends BasePayment implements PaymentMethod {
    @Override
    public void pay(int amount) {
        // implementation
    }
}
```

These method kinds have different invocation, inheritance, and overriding rules. This chapter only establishes the taxonomy; the dedicated interface-method milestone explains `default`, `static`, and `private` in detail.
