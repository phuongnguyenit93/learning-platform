Two common assumptions are incorrect:

```text
interface is annotated
→ implementing class automatically inherits that annotation

superclass method is annotated
→ overriding method automatically inherits that method annotation
```

Neither follows from `@Inherited`.

### Interface boundary

```java
@AuditedComponent
interface PaymentPort {
}

class CardPayment implements PaymentPort {
}
```

`@Inherited` does not make `CardPayment` inherit an annotation from `PaymentPort`. Frameworks that want interface metadata must explicitly inspect interfaces according to their own lookup policy.

### Method boundary

```java
class BaseService {
    @Audit(action = "PAYMENT")
    void pay() {
    }
}

class PaymentService extends BaseService {
    @Override
    void pay() {
    }
}
```

The overriding `PaymentService.pay()` method does not automatically acquire `@Audit` from `BaseService.pay()` merely because the method overrides it. A framework may deliberately search overridden methods, but that is framework behavior, not Java's `@Inherited` contract.

### PRACTICE — define lookup semantics as part of framework design

When writing an annotation consumer, document whether it searches:

- only the exact declaration;
- superclasses;
- implemented interfaces;
- overridden methods;
- repeatable containers.

Java reflection provides building blocks, but a framework's broader “find merged metadata” behavior can be richer than the core language rules.

Runtime lookup is only one way to consume annotations. The next chapter moves to a different lifecycle entirely: compile-time annotation processing, where tools inspect source/program models and can generate new artifacts before the application runs.
