A dependency may be needed for just one operation:

```java
Receipt checkout(PaymentGateway gateway) {
    return gateway.charge(...);
}
```

If a collaborator is a stable part of object state, a field association may be more appropriate:

```java
class CheckoutService {
    private final PaymentGateway gateway;
}
```

A collaborator stored in a field is not necessarily strongly owned. Two services may hold the same mutable object. In that case aliasing, shared mutation, and lifecycle contracts matter more than the mere presence of a field/reference.

### TRADE-OFF

Do not force every parameter to be labeled “dependency” and every field “association” when the distinction adds no reasoning value. The goal is to understand coupling and lifetime, not classify every reference for its own sake.
