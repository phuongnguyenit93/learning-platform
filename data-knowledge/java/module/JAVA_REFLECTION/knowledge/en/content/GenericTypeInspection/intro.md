# Generic Signature Metadata after Erasure

Once reflection can inspect classes and members, another question appears: Java uses **type erasure**, so what can runtime code still know about `List<String>`, `T extends Number`, or `? super Integer`?

The answer has two parts. The JVM generally does not carry each object's type arguments as separate runtime generic type identities, but the compiler can store **generic signature metadata** in the class file. Reflection reads that declaration metadata through `Type` and its subtypes.

This chapter assumes the learner has already covered the Generics module. Only four ideas need to be carried forward: **erasure** removes most type arguments from the execution-time type; a **type variable** is a variable such as `T`; a **bound** constrains what `T` can represent; and a **wildcard** such as `? extends X` / `? super X` describes a declaration-side type relationship. The goal here is not to reteach Generics, but to learn **how reflection represents those declarations as runtime metadata**.

The running domain is still the payment model. A natural generic field could be:

```java
class PaymentService {
    private List<PaymentRequest> recentRequests;
}
```

Reflection sees `List.class` as the raw type while the retained generic declaration can still describe `List<PaymentRequest>`.

`PaymentService` does not naturally demonstrate every generic shape. From this point, `Repository<T ...>` is therefore a **supporting specimen only** for observing `TypeVariable`, wildcards, and generic arrays without distorting the main payment model:

```java
class Repository<T extends Number & Comparable<T>> {
    List<? extends T> values;
    List<? super Integer> sinks;
    T[] buffer;
}
```

It still follows the same reflection mental model: source declarations become class metadata, and reflection reconstructs a model that tools and frameworks can inspect at runtime.
