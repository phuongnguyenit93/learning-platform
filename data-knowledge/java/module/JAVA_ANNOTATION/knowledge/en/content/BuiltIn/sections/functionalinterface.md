> **Beginner boundary:** this module focuses on how `@FunctionalInterface` makes a design intention compiler-checked. Lambda, method-reference, and function-type mechanics belong to Functional Programming.

`@FunctionalInterface` expresses that an interface is intended to have one abstract function contract and asks the compiler to verify that property.

```java
@FunctionalInterface
interface PaymentRule {
    boolean allow(int amount);

    default PaymentRule negate() {
        return amount -> !allow(amount);
    }
}
```

Default, static, and private interface methods do not add abstract function contracts. Methods that merely correspond to public methods of `Object` also do not make the interface non-functional under the functional-interface rules.

An interface can still be a functional interface without the annotation. Adding `@FunctionalInterface` makes the design intention compiler-checked so an accidental second abstract method is caught early.

Built-in annotations demonstrate the core idea well: metadata is valuable because its consumer has a defined contract. The next chapter applies that idea to metadata vocabularies designed by application and library authors.
